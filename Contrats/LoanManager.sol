    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Minimal {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @title LoanManager - simple lending/borrowing with ETH collateral and ERC20 loan token
/// @notice Diseño educativo para un proyecto de préstamos. No para producción sin auditoría.
contract LoanManager {
    IERC20Minimal public immutable loanToken; // token usado para el préstamo (ej. mUSD)
    uint256 public nextLoanId;

    struct Loan {
        address borrower;
        address lender;
        uint256 principal;       // cantidad de token prestado (con decimales del token)
        uint256 collateralWei;   // colateral depositado en ETH (wei)
        uint256 interestBP;      // interés total en basis points (1% = 100)
        uint256 duration;        // duración en segundos
        uint256 startTime;       // cuando fue financiado
        bool funded;
        bool withdrawn;
        bool repaid;
    }

    mapping(uint256 => Loan) public loans;

    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 principal, uint256 collateralWei, uint256 interestBP, uint256 duration);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanWithdrawn(uint256 indexed loanId, address indexed borrower);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 repayAmount);
    event LoanLiquidated(uint256 indexed loanId, address indexed lender);

    constructor(address _loanToken) {
        loanToken = IERC20Minimal(_loanToken);
        nextLoanId = 1;
    }

    /// @notice Create a loan request and deposit ETH as collateral
    /// @param principal amount of loan requested in token units (token decimals apply)
    /// @param interestBP interest for the whole loan in basis points (e.g., 500 = 5%)
    /// @param durationSeconds duration until repayment required (seconds)
    function requestLoan(uint256 principal, uint256 interestBP, uint256 durationSeconds) external payable returns (uint256) {
        require(principal > 0, "Principal > 0");
        require(msg.value > 0, "Collateral > 0 (ETH)");
        require(durationSeconds >= 60, "Duration minimo 60s");

        uint256 id = nextLoanId++;
        loans[id] = Loan({
            borrower: msg.sender,
            lender: address(0),
            principal: principal,
            collateralWei: msg.value,
            interestBP: interestBP,
            duration: durationSeconds,
            startTime: 0,
            funded: false,
            withdrawn: false,
            repaid: false
        });

        emit LoanRequested(id, msg.sender, principal, msg.value, interestBP, durationSeconds);
        return id;
    }

    /// @notice Lender funds a loan by transferring principal tokens to this contract (must approve first)
    function fundLoan(uint256 loanId) external {
        Loan storage L = loans[loanId];
        require(L.borrower != address(0), "Loan inexistente");
        require(!L.funded, "Ya financiado");
        require(L.lender == address(0), "Ya tiene lender");

        // transfer tokens from lender to this contract
        bool ok = loanToken.transferFrom(msg.sender, address(this), L.principal);
        require(ok, "transferFrom fallo");

        L.lender = msg.sender;
        L.funded = true;
        L.startTime = block.timestamp;

        emit LoanFunded(loanId, msg.sender);
    }

    /// @notice Borrower withdraws the funded loan tokens to their account
    function withdrawLoan(uint256 loanId) external {
        Loan storage L = loans[loanId];
        require(L.funded, "No financiado");
        require(!L.withdrawn, "Ya retirado");
        require(msg.sender == L.borrower, "Solo borrower");

        L.withdrawn = true;
        bool ok = loanToken.transfer(L.borrower, L.principal);
        require(ok, "transfer fallo");

        emit LoanWithdrawn(loanId, L.borrower);
    }

    /// @notice Borrower repays principal + interest (interest = principal * interestBP / 10000)
    /// borrower must approve tokens to this contract before calling repayLoan
    function repayLoan(uint256 loanId) external {
        Loan storage L = loans[loanId];
        require(L.borrower != address(0), "Loan inexistente");
        require(L.funded, "No financiado");
        require(!L.repaid, "Ya pagado");
        require(msg.sender == L.borrower, "Solo borrower");

        uint256 interest = (L.principal * L.interestBP) / 10000;
        uint256 repayAmount = L.principal + interest;

        // transfer repayAmount from borrower to contract
        bool ok = loanToken.transferFrom(msg.sender, address(this), repayAmount);
        require(ok, "transferFrom repay fallo");

        // send principal+interest to lender
        bool ok2 = loanToken.transfer(L.lender, repayAmount);
        require(ok2, "transfer to lender fallo");

        // return collateral to borrower
        uint256 collateral = L.collateralWei;
        L.collateralWei = 0;
        L.repaid = true;

        (bool sent, ) = L.borrower.call{value: collateral}("");
        require(sent, "Envio collateral fallo");

        emit LoanRepaid(loanId, L.borrower, repayAmount);
    }

    /// @notice Lender can liquidate and claim collateral if loan past due and not repaid
    function liquidate(uint256 loanId) external {
        Loan storage L = loans[loanId];
        require(L.borrower != address(0), "Loan inexistente");
        require(L.funded, "No financiado");
        require(!L.repaid, "Ya pagado");
        require(msg.sender == L.lender, "Solo lender");
        require(block.timestamp > L.startTime + L.duration, "Aun no vencido");

        uint256 collateral = L.collateralWei;
        L.collateralWei = 0;
        L.repaid = true; // mark as finished

        (bool sent, ) = L.lender.call{value: collateral}("");
        require(sent, "Envio collateral fallo");

        emit LoanLiquidated(loanId, L.lender);
    }

    /// @notice Cancel a request if not funded; returns collateral to requester
    function cancelRequest(uint256 loanId) external {
        Loan storage L = loans[loanId];
        require(L.borrower != address(0), "Loan inexistente");
        require(!L.funded, "Ya financiado");
        require(msg.sender == L.borrower, "Solo borrower");

        uint256 collateral = L.collateralWei;
        L.collateralWei = 0;
        delete loans[loanId];

        (bool sent, ) = msg.sender.call{value: collateral}("");
        require(sent, "Envio collateral fallo");
    }

    // --- helpers para UI ---
    function isOverdue(uint256 loanId) public view returns (bool) {
        Loan storage L = loans[loanId];
        if (!L.funded || L.repaid) return false;
        return block.timestamp > (L.startTime + L.duration);
    }

    receive() external payable {
        revert("No enviar ETH directamente");
    }
    fallback() external payable {
        revert("fallback");
    }
}
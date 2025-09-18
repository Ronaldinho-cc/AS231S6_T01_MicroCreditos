import { useCallback, useEffect, useState } from 'react'
import { connectWallet, onAccountsChanged, onChainChanged, removeEthereumListener, WalletConnection } from '../web3/ethereum'

export default function ConnectWallet() {
	const [connection, setConnection] = useState<WalletConnection | null>(null)
	const [connecting, setConnecting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleConnect = useCallback(async () => {
		setError(null)
		setConnecting(true)
		try {
			const conn = await connectWallet()
			setConnection(conn)
		} catch (e: any) {
			setError(e?.message ?? 'Error al conectar la wallet')
		} finally {
			setConnecting(false)
		}
	}, [])

	useEffect(() => {
		function handleAccounts(accs: string[]) {
			if (!accs || accs.length === 0) {
				setConnection(null)
				return
			}
			setConnection((prev) => (prev ? { ...prev, accountAddress: accs[0] } : prev))
		}
		function handleChain(chainId: string) {
			setConnection((prev) => (prev ? { ...prev, chainIdHex: chainId } : prev))
		}
		onAccountsChanged(handleAccounts)
		onChainChanged(handleChain)
		return () => {
			removeEthereumListener('accountsChanged', handleAccounts)
			removeEthereumListener('chainChanged', handleChain)
		}
	}, [])

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'start' }}>
			{connection ? (
				<>
					<div><strong>Cuenta:</strong> {connection.accountAddress}</div>
					<div><strong>Red:</strong> {connection.chainIdHex}</div>
				</>
			) : (
				<button onClick={handleConnect} disabled={connecting}>
					{connecting ? 'Conectando...' : 'Conectar MetaMask'}
				</button>
			)}
			{error && <div style={{ color: 'tomato' }}>{error}</div>}
		</div>
	)
} 
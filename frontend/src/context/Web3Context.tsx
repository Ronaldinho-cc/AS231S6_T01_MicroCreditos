import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserProvider } from 'ethers'
import type { ReactNode } from 'react'
import { connectWallet, getInjectedProvider, onAccountsChanged, onChainChanged, removeEthereumListener } from '../web3/ethereum'
import type { WalletConnection } from '../web3/ethereum'

export type SupportedNetwork = {
	chainIdHex: string
	name: string
}

const DEFAULT_NETWORK: SupportedNetwork = { chainIdHex: '0xaa36a7', name: 'Sepolia' } // 11155111

export type Web3Session = {
	accountAddress: string | null
	chainIdHex: string | null
	provider: BrowserProvider | null
	signerAddress: string | null
	isConnected: boolean
	networkOk: boolean
}

export type Web3ContextType = {
	session: Web3Session
	connect: () => Promise<void>
	disconnect: () => void
	signMessage: (message: string) => Promise<string>
	requiredNetwork: SupportedNetwork
}

export const Web3Context = createContext<Web3ContextType | null>(null)

const LOCAL_KEY = 'web3.session.v1'

export function Web3Provider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Web3Session>({
		accountAddress: null,
		chainIdHex: null,
		provider: null,
		signerAddress: null,
		isConnected: false,
		networkOk: false,
	})

	const persist = useCallback((s: Web3Session) => {
		try { localStorage.setItem(LOCAL_KEY, JSON.stringify({ accountAddress: s.accountAddress, chainIdHex: s.chainIdHex })) } catch {}
	}, [])

	const connect = useCallback(async () => {
		const conn: WalletConnection = await connectWallet()
		const networkOk = conn.chainIdHex.toLowerCase() === DEFAULT_NETWORK.chainIdHex
		setSession({
			accountAddress: conn.accountAddress,
			chainIdHex: conn.chainIdHex,
			provider: conn.provider,
			signerAddress: await conn.signer.getAddress(),
			isConnected: true,
			networkOk,
		})
		persist({
			accountAddress: conn.accountAddress,
			chainIdHex: conn.chainIdHex,
			provider: conn.provider,
			signerAddress: await conn.signer.getAddress(),
			isConnected: true,
			networkOk,
		})
	}, [persist])

	const disconnect = useCallback(() => {
		setSession({ accountAddress: null, chainIdHex: null, provider: null, signerAddress: null, isConnected: false, networkOk: false })
		try { localStorage.removeItem(LOCAL_KEY) } catch {}
	}, [])

	const signMessage = useCallback(async (message: string) => {
		if (!session.provider || !session.accountAddress) throw new Error('No conectado')
		const signer = await session.provider.getSigner()
		return await signer.signMessage(message)
	}, [session.provider, session.accountAddress])

	// Auto-reconnect en carga si ya hay permisos
	useEffect(() => {
		(async () => {
			const injected = await getInjectedProvider()
			if (!injected) return
			try {
				const accounts = (await injected.request({ method: 'eth_accounts' })) as string[]
				if (accounts && accounts.length > 0) {
					await connect()
				}
			} catch {}
		})()
	}, [connect])

	// Escuchar cambios de cuenta/red
	useEffect(() => {
		function handleAccounts(accs: string[]) {
			if (!accs || accs.length === 0) {
				disconnect()
				return
			}
			setSession((prev) => ({ ...prev, accountAddress: accs[0], isConnected: true }))
		}
		function handleChain(chainId: string) {
			setSession((prev) => ({ ...prev, chainIdHex: chainId, networkOk: chainId.toLowerCase() === DEFAULT_NETWORK.chainIdHex }))
		}
		onAccountsChanged(handleAccounts)
		onChainChanged(handleChain)
		return () => {
			removeEthereumListener('accountsChanged', handleAccounts)
			removeEthereumListener('chainChanged', handleChain)
		}
	}, [disconnect])

	const value = useMemo<Web3ContextType>(() => ({ session, connect, disconnect, signMessage, requiredNetwork: DEFAULT_NETWORK }), [session, connect, disconnect, signMessage])

	return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
} 
import detectEthereumProvider from '@metamask/detect-provider'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import type { Eip1193Provider } from 'ethers'

export type WalletConnection = {
	accountAddress: string
	chainIdHex: string
	provider: BrowserProvider
	signer: JsonRpcSigner
}

export async function getInjectedProvider(): Promise<Eip1193Provider | null> {
	const provider = (await detectEthereumProvider()) as Eip1193Provider | null
	return provider ?? null
}

export async function connectWallet(): Promise<WalletConnection> {
	const injected = await getInjectedProvider()
	if (!injected) {
		throw new Error('MetaMask no está instalada. Instálala desde https://metamask.io')
	}

	// Solicitar cuentas
	const accounts = (await injected.request({ method: 'eth_requestAccounts' })) as string[]
	if (!accounts || accounts.length === 0) {
		throw new Error('No se obtuvo ninguna cuenta de MetaMask')
	}

	const chainIdHex = (await injected.request({ method: 'eth_chainId' })) as string
	const provider = new BrowserProvider(injected)
	const signer = await provider.getSigner()

	return {
		accountAddress: accounts[0],
		chainIdHex,
		provider,
		signer,
	}
}

export function onAccountsChanged(handler: (accounts: string[]) => void) {
	const w = window as unknown as { ethereum?: Eip1193Provider & { on?: Function; removeListener?: Function } }
	if (w.ethereum && typeof (w.ethereum as any).on === 'function') {
		;(w.ethereum as any).on('accountsChanged', handler)
	}
}

export function onChainChanged(handler: (chainId: string) => void) {
	const w = window as unknown as { ethereum?: Eip1193Provider & { on?: Function; removeListener?: Function } }
	if (w.ethereum && typeof (w.ethereum as any).on === 'function') {
		;(w.ethereum as any).on('chainChanged', handler)
	}
}

export function removeEthereumListener(event: 'accountsChanged' | 'chainChanged', handler: Function) {
	const w = window as unknown as { ethereum?: Eip1193Provider & { removeListener?: Function } }
	if (w.ethereum && typeof (w.ethereum as any).removeListener === 'function') {
		;(w.ethereum as any).removeListener(event, handler as any)
	}
} 
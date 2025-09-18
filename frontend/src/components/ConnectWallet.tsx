import { useCallback, useContext, useState } from 'react'
import { Web3Context } from '../context/Web3Context'

export default function ConnectWallet() {
	const web3 = useContext(Web3Context)
	const [signing, setSigning] = useState(false)
	if (!web3) return null

	const { session, connect, disconnect, signMessage, requiredNetwork } = web3

	const handleConnect = useCallback(async () => {
		await connect()
	}, [connect])

	const handleDisconnect = useCallback(() => {
		disconnect()
	}, [disconnect])

	const handleSign = useCallback(async () => {
		setSigning(true)
		try {
			await signMessage('Inicio de sesión en MicroCréditos Web3')
		} finally {
			setSigning(false)
		}
	}, [signMessage])

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
			{session.isConnected ? (
				<>
					<span style={{ fontSize: 12, opacity: .85, whiteSpace: 'nowrap' }}> {session.accountAddress?.slice(0,6)}…{session.accountAddress?.slice(-4)} </span>
					{!session.networkOk && (
						<span style={{ color: 'tomato', fontSize: 12, whiteSpace: 'nowrap' }}>Cámbiate a {requiredNetwork.name}</span>
					)}
					<button className="btn" onClick={handleSign} disabled={signing}>Firmar</button>
					<button className="btn" onClick={handleDisconnect}>Desconectar</button>
				</>
			) : (
				<button className="btn btn-primary" onClick={handleConnect}>Conectar MetaMask</button>
			)}
		</div>
	)
} 
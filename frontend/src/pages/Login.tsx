import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { connectWallet } from '../web3/ethereum'
import type { WalletConnection } from '../web3/ethereum'

export default function Login() {
	const navigate = useNavigate()
	const [connecting, setConnecting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [connection, setConnection] = useState<WalletConnection | null>(null)

	const handleConnect = useCallback(async () => {
		setError(null)
		setConnecting(true)
		try {
			const conn = await connectWallet()
			setConnection(conn)
			navigate('/app/home')
		} catch (e: any) {
			setError(e?.message ?? 'No se pudo conectar con MetaMask')
		} finally {
			setConnecting(false)
		}
	}, [navigate])

	return (
		<div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
			<div className="card form-card" style={{ background: 'rgba(255,255,255,0.06)' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
					<img src="/src/assets/brand.svg" alt="Logo" width={28} height={28} />
					<h2 style={{ margin: 0 }}>Conectar wallet</h2>
				</div>
				<p className="hero-sub">Usa MetaMask para autenticarte y continuar.</p>
				<button onClick={handleConnect} disabled={connecting} className="btn btn-primary" style={{ width: '100%' }}>
					{connecting ? 'Conectando...' : 'Conectar con MetaMask'}
				</button>
				{connection && (
					<div style={{ marginTop: 12, fontSize: 12 }}>
						Conectado: {connection.accountAddress}
					</div>
				)}
				{error && <div style={{ color: 'tomato', marginTop: 12 }}>{error}</div>}
				<div style={{ marginTop: 12 }}>
					<button disabled className="btn btn-ghost" style={{ width: '100%' }}>Coinbase Wallet (próximamente)</button>
				</div>
				<div style={{ marginTop: 16, textAlign: 'center' }}>
					<button onClick={() => navigate('/app/home')} className="btn" style={{ width: '100%' }}>Continuar</button>
				</div>
			</div>
		</div>
	)
} 
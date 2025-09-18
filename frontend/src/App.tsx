import './App.css'
import ConnectWallet from './components/ConnectWallet'

function App() {
	return (
		<div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
			<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
				<h1 style={{ margin: 0 }}>MicroCréditos Web3</h1>
				<ConnectWallet />
			</header>
			<main style={{ display: 'grid', gap: 16 }}>
				<section>
					<h2>Solicita o financia microcréditos</h2>
					<p>Conecta tu wallet para continuar.</p>
				</section>
			</main>
		</div>
	)
}

export default App

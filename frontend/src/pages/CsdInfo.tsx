export default function CsdInfo() {
	return (
		<div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
			<div className="card" style={{ width: 420, padding: 22 }}>
				<h2 style={{ marginTop: 0 }}>¿Qué es el CSD?</h2>
				<p className="hero-sub">El Crédito Solidario Descentralizado es un modelo financiero con economía solidaria y blockchain para ofrecer créditos justos y confiables.</p>
				<div style={{ display: 'grid', placeItems: 'center', marginTop: 12 }}>
					<img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fexample.org" alt="QR" width={220} height={220} />
				</div>
			</div>
		</div>
	)
} 
export default function KycVerification() {
	return (
		<div className="container">
			<div className="card form-card">
				<h2 style={{ marginTop: 0 }}>Verificación de identidad</h2>
				<p className="hero-sub">Esto tomará unos 2 minutos. Sube tu cédula y selfie.</p>
				<div className="form-grid">
					<label>
						<span className="label">Documento</span>
						<input className="input" type="file" accept="image/*,application/pdf" />
					</label>
					<label>
						<span className="label">Selfie</span>
						<input className="input" type="file" accept="image/*" />
					</label>
					<button className="btn btn-primary">Verificar y continuar</button>
				</div>
			</div>
		</div>
	)
} 
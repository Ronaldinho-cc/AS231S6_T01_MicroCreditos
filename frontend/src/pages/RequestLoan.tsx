export default function RequestLoan() {
	return (
		<div className="container">
			<div className="card form-card">
				<h2 style={{ marginTop: 0 }}>Solicitar Microcrédito</h2>
				<div className="form-grid">
					<label>
						<span className="label">Monto solicitado (USDC)</span>
						<input className="input" type="number" min={0} step={1} defaultValue={50} />
					</label>
					<label>
						<span className="label">Plazo de pago</span>
						<select className="select">
							<option>3 meses</option>
							<option>6 meses</option>
							<option>9 meses</option>
						</select>
					</label>
					<label>
						<span className="label">Propósito</span>
						<select className="select">
							<option>Educación</option>
							<option>Emprendimiento</option>
							<option>Salud</option>
						</select>
					</label>
					<button className="btn btn-primary">Solicitar y firmar</button>
				</div>
			</div>
		</div>
	)
} 
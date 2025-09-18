export default function Register() {
	return (
		<div className="container">
			<div className="card form-card">
				<h2 style={{ marginTop: 0 }}>Registrarte</h2>
				<div className="form-grid">
					<label>
						<span className="label">Email</span>
						<input className="input" placeholder="tu@email.com" />
					</label>
					<label>
						<span className="label">Contraseña</span>
						<input className="input" type="password" placeholder="••••••••" />
					</label>
					<button className="btn btn-primary">Crear cuenta</button>
				</div>
			</div>
		</div>
	)
} 
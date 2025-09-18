import { NavLink, Outlet } from 'react-router-dom'
import ConnectWallet from './ConnectWallet'

export default function DashboardLayout() {
	return (
		<div className="dashboard" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
			<aside style={{ padding: 16, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
				<div className="brand" style={{ marginBottom: 16 }}>
					<img className="brand-logo" src="/src/assets/brand.svg" alt="Logo" />
					<span className="brand-name">MicroCréditos</span>
				</div>
				<nav style={{ display: 'grid', gap: 8 }}>
					<NavLink to="/app/home" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
						Inicio
					</NavLink>
					<NavLink to="/app/register" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
						Registro
					</NavLink>
					<NavLink to="/app/kyc" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
						Verificación KYC
					</NavLink>
					<NavLink to="/app/request" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
						Solicitar crédito
					</NavLink>
					<NavLink to="/app/approved" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
						Aprobación
					</NavLink>
					<NavLink to="/app/csd" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
						¿Qué es el CSD?
					</NavLink>
				</nav>
			</aside>
			<section>
				<header className="header" style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
					<div />
					<ConnectWallet />
				</header>
				<div className="container" style={{ padding: 16 }}>
					<Outlet />
				</div>
			</section>
		</div>
	)
} 
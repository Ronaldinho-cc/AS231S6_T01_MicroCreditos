import { NavLink, Outlet } from 'react-router-dom'
import ConnectWallet from './ConnectWallet'

export default function MobileLayout() {
	return (
		<div className="mobile-frame">
			<div className="mobile-content">
				<header className="header mobile-header" style={{ padding: 10 }}>
					<div className="brand" style={{ gap: 8 }}>
						<img className="brand-logo" src="/src/assets/brand.svg" alt="Logo" />
						<span className="brand-name">MicroCréditos</span>
					</div>
					<ConnectWallet />
				</header>
				<main style={{ padding: 0, paddingBottom: 76 }}>
					<div className="container" style={{ paddingTop: 12, paddingBottom: 12 }}>
						<Outlet />
					</div>
				</main>
				<nav aria-label="bottom-tabs" className="mobile-bottom" style={{ zIndex: 10 }}>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, padding: 8 }}>
						<NavLink to="/app/home" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Inicio</NavLink>
						<NavLink to="/app/request" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Pedir</NavLink>
						<NavLink to="/app/kyc" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>KYC</NavLink>
						<NavLink to="/app/approved" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Estado</NavLink>
						<NavLink to="/app/csd" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}>CSD</NavLink>
					</div>
				</nav>
			</div>
		</div>
	)
} 
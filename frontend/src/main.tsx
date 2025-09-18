import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login'
import Register from './pages/Register'
import KycVerification from './pages/KycVerification'
import RequestLoan from './pages/RequestLoan'
import Approval from './pages/Approval'
import CsdInfo from './pages/CsdInfo'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Web3Provider } from './context/Web3Context'
import DashboardLayout from './components/DashboardLayout'

const router = createBrowserRouter([
	{ path: '/', element: <Login /> },
	{ path: '/login', element: <Login /> },
	{
		path: '/app',
		element: <DashboardLayout />,
		children: [
			{ path: 'home', element: <App /> },
			{ path: 'register', element: <Register /> },
			{ path: 'kyc', element: <KycVerification /> },
			{ path: 'request', element: <RequestLoan /> },
			{ path: 'approved', element: <Approval /> },
			{ path: 'csd', element: <CsdInfo /> },
		],
	},
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Web3Provider>
			<RouterProvider router={router} />
		</Web3Provider>
	</StrictMode>,
)

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/src/sw.ts').catch(() => {})
	})
}

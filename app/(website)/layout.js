import './website.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AuthProvider from '../AuthProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CartProvider } from '@/components/CartContext'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'ShopIC',
	description: 'descricao',
}

export default function RootLayout({ children }) {
	return (
		<AuthProvider>
			<html lang="en">
				<body
					className={`${inter.className} flex flex-col items-center justify-center`}
				>
					<CartProvider>
						<Navbar />
						<ToastContainer></ToastContainer>
						{children}
						<Footer />
					</CartProvider>
				</body>
			</html>
		</AuthProvider>
	)
}

"use client"
import { theme } from '@/utils/tailwind';
import { FilesIcon, PackageIcon, SettingsIcon, UsersIcon, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Image from 'next/image';

export default function AdminNavbar() {
	const [collapsed, setCollapsed] = React.useState(false)

	React.useEffect(() => {
		// only execute all the code below in client side
		// Handler to call on window resize
		function handleResize() {
			setCollapsed(window.innerWidth < 1000)
		}

		// Add event listener
		window.addEventListener('resize', handleResize)

		// Call handler right away so state gets updated with initial window size
		handleResize()

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize)
	}, []) // Empty array ensures that effect is only run on mount

	return (
		<Sidebar
			rootStyles={{ borderRightColor: theme.colors.zinc[300] }}
			className="bg-zinc-300 text-zinc-900"
			collapsed={collapsed}
		>
			<header className="text-zinc-100 mx-auto flex items-center justify-center w-full bg-zinc-200 py-12">
				<Link href="/admin" className="w-max">
					<Image
						src="/static/images/logo.png"
						alt="me"
						width="64"
						height="64"
						className="mx-auto"
					/>
					<h1 className="font-primary text-zinc-900 font-black text-3xl">
						SHOPIC
					</h1>
				</Link>
			</header>
			<Menu
				menuItemStyles={{
					button: {
						paddingLeft: theme.padding[1],
						'&:only-child': {
							paddingLeft: theme.padding[4],
						},
						'&:hover': {
							backgroundColor: theme.colors.zinc[300],
						},
					},
					subMenuContent: {
						width: 'auto',
						minWidth: '200px',
					},
				}}
			>
				<SubMenu icon={<UsersIcon></UsersIcon>} label="Usuários">
					<MenuItem
						component={<Link href="/admin/users"></Link>}
						className="bg-zinc-300"
					>
						{' '}
						Gerenciar usuários{' '}
					</MenuItem>
				</SubMenu>
				<SubMenu icon={<PackageIcon></PackageIcon>} label="Produtos">
					<MenuItem
						component={<Link href="/admin/products/add"></Link>}
						className="bg-zinc-300"
					>
						{' '}
						Adicionar novo produto{' '}
					</MenuItem>
					<MenuItem
						component={<Link href="/admin/products"></Link>}
						className="bg-zinc-300"
					>
						{' '}
						Gerenciar produtos{' '}
					</MenuItem>
					<MenuItem
						component={
							<Link href="/admin/products/categories/add"></Link>
						}
						className="bg-zinc-300"
					>
						{' '}
						Adicionar categoria{' '}
					</MenuItem>
					<MenuItem
						component={<Link href="/admin/products/categories"></Link>}
						className="bg-zinc-300"
					>
						{' '}
						Gerenciar categorias{' '}
					</MenuItem>
				</SubMenu>
				<SubMenu icon={<SettingsIcon></SettingsIcon>} label="Configurações">
					<MenuItem
						component={<Link href="/admin/settings"></Link>}
						className="bg-zinc-300"
					>
						{' '}
						Geral do site{' '}
					</MenuItem>
				</SubMenu>
			</Menu>
		</Sidebar>
	)
}
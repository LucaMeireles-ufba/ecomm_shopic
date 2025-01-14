'use client'
import Link from 'next/link'
import { SearchProduct } from '@/components/SearchProduct'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react'

// Adicionar server actions aqui para editar e deletar
export function AdminTable(props) {
	const [filterValue, setFilterValue] = useState('')
	const [propsData, setPropsData] = useState([])

	useEffect(() => {
		if (filterValue) {
			setPropsData(
				props.data.filter((el) => {
					return el.name.toLowerCase().includes(filterValue.toLowerCase())
				})
			)
		}
	}, [filterValue, props.data])

	useEffect(() => {
		if (props.data) {
			setPropsData(props.data)
		}
	}, [props.data])

	return (
		<div className="flex flex-col items-center justify-center gap-4 w-full">
			{props.hasSearchBar && (
				<SearchProduct
					placeholder="Pesquisa pelo nome"
					filterValue={filterValue}
					setFilterValue={setFilterValue}
					className="w-3"
				/>
			)}

			<div className="bg-white p-8 text-zinc-700 border-solid rounded-lg h-fit w-full">
				<h1 className="text-2xl font-bold mb-4 border-b-zinc-600 border-b">
					{props.title}
				</h1>
				<Table className="min-w-full border-collapse border border-zinc-300 rounded-lg overflow-hidden">
					<TableHead>
						<TableRow className="bg-gray-100 text-black">
							{props.headers.map((header) => {
								return (
									<TableHeaderCell key={header} className="border p-4">
										{header}
									</TableHeaderCell>
								)
							})}
						</TableRow>
					</TableHead>

					<TableBody>
						{propsData.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								{Object.keys(row).map((key) => (
									<TableCell key={key} className="border p-4">
										{row[key]}
									</TableCell>
								))}
								<TableCell className="border p-4">
									{props.actions.map((action, index) => (
										<Link
											key={action.name + '-' + index}
											href={action.dest.replace('$1', row.id)}
										>
											<button
												className={
													'bg-' +
													action.color +
													'-300 hover:bg-' +
													action.color +
													'-700 text-zin-900 hover:text-zinc-100 font-bold py-2 px-4 mr-2'
												}
											>
												{action.name}
											</button>
										</Link>
									))}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

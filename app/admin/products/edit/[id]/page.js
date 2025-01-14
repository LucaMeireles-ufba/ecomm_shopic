//import { useRouter } from "next/navigation";
import { queryProductByID } from './actions'
import Image from 'next/image'
import RenderStars from '@/components/ui/stars'
import EditIcon from '@/components/admin/editIcon'
import EditableTable from '@/components/admin/editableTable/editableTable'

const action = {
	name: 'Salvar',
	dest: '/admin/products/edit/$1',
}

const headers = ['ID', 'SKU', 'Preço', 'Tamanho', 'Cor', 'Estoque', 'Ação']

export default async function EditProduct({ params }) {
	const productID = params.id
	//const productID = useRouter().query.id
	let product = await queryProductByID(parseInt(productID))
	let productItems = product.product_item

	return (
		<div className="py-3 px-2 self-center grow flex flex-col items-center gap-4 text-white">
			<div className="flex gap-3 max-w-3xl">
				<div>
					<Image
						src={`https://picsum.photos/id/${Math.round(
							Math.random() * 1084
						)}/200`}
						alt="Foto do produto"
						width={300}
						height={300}
					/>
					<div className="flex items-center mt-2">
						<RenderStars rating={product.rating}></RenderStars>
					</div>
				</div>
				<div className="w-fit">
					<div className="flex justify-between items-center pb-4">
						<h3 className="text-2xl font-bold border-b-zinc-600 border-b">
							{product.name}
						</h3>
						<EditIcon />
					</div>

					<p>{product.description}</p>
				</div>
			</div>

			<div className="max-w-[70%] overflow-x-auto">
				<EditableTable
					title="Sub-produtos"
					headers={headers}
					data={productItems}
					action={action}
				/>
			</div>
		</div>
	)
}

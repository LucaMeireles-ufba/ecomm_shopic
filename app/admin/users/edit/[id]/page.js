import { AdminForm } from "@/components/admin/adminForm"
import { prisma } from "@/utils/prisma";
import updateUser from "./actions";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AddEditUser({ params, searchParams }) {
	let user
	if (params.id) {
		user = await prisma.user.findFirst({ where: { id: params.id } })
	}
	if (!user)
		return (
			<div className="flex justify-center w-full items-center">
				<p>Usuário não encontrado</p>
			</div>
		)
	const fields = [{
		"name": "id",
		"type": "hidden",
		"value": user.id
	},{
		"name": "name",
		"label": "Nome",
		"type": "text",
		"value": user.name
	},
	{
		"name": "email",
		"label": "Email",
		"type": "text",
		"value": user.email,
		"disabled": true
	},
	{
		"name": "role",
		"label": "Permissões",
		"type": "select",
		"value": user.role,
		"options": [
			{
				id: "admin",
				name: "Administrador",
			},
			{
				id: "user",
				name: "Usuário",
			}
		]
	}
	];
	return (
		<div className="flex justify-center w-full items-center">
			<AdminForm formTitle="Atualizar Usuário" action={updateUser} fields={fields} buttonLabel="Salvar" notify={searchParams.result} />
		</div>
	)
}
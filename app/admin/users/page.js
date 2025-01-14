
"use server"
import { prisma } from "@/utils/prisma"
import { AdminTable } from "@/components/admin/adminTable"


export default async function ManageUsers() {
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  });
  const actions = [
    {
      name: 'Editar',
      color: 'stone',
      dest: '/admin/users/edit/$1'
    }
  ];
  const headers = ['id', 'Nome', 'E-Mail', "Ações"];

  return (
    <AdminTable title="Usuários" headers={headers} data={users} actions={actions} />
  )

}
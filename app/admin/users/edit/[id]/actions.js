"use server"

import { prisma } from "@/utils/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getServerSession } from '@/app/api/auth/[...nextauth]/route'

export default async function updateUser(params) {
    const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }
    const id = params.get('id')
    const role = params.get('role')
    if (id && role) {
        const update = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                role: role
            }
        })
        if (update)
            return redirect("/admin/users/edit/" + id + "?result=true", "replace")
        return redirect("/admin/users/edit/" + id + "?result=false", "replace")
    }
}
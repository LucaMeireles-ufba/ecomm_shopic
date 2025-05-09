import { prisma } from "@/utils/prisma"
import { getServerSession } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  const body = await req.json()
  const { sku } = body

  if (!sku) {
    return Response.json({ success: false, error: "Missing SKU" })
  }

  const session = await getServerSession()
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, error: "Unauthorized" })
  }

  try {
    await prisma.productItem.delete({
      where: { sku }
    })
    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false, error: error.message })
  }
}

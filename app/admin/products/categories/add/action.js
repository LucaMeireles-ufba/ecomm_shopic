"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from '@/app/api/auth/[...nextauth]/route'

async function CreateProductCategory(data) {
  const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }
  const newProductCategory = await prisma.productCategory.create({
    data: { name: data.get("categoryName") },
  });

  const categoryId = newProductCategory.id;
  redirect(`/admin/products/categories/${categoryId}/edit`);
}

async function removeProductCategory(data) {
  const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }
  await prisma.productCategory.delete({
    where: {
      id: +data.get("id"),
    },
  });

  redirect("/productCategory/");
}

async function updateProductCategory(data) {
  const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }

  await prisma.productCategory.update({
    where: {
      id: parseInt(data.id),
    },
    data: {
      name: data.name,
    },
  });
  revalidatePath("/productCategory/");
}

async function queryAllProductCategories() {
  const session = await getServerSession()
    if (!session || !session.user.role || session.user.role != "admin") {
        return false
    }
  return await prisma.productCategory.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy:{
      id:"asc"
    }
  })
}

export {
  CreateProductCategory,
  removeProductCategory,
  updateProductCategory,
  queryAllProductCategories
};

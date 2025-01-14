'use server'

import { prisma } from "@/utils/prisma"

async function queryAllProducts() {
	const products = await prisma.product.findMany({
	  include: {
		product_item: {
		  select: {
			price: true,
			amount: true
		  }
		}
	  }
	});
	return products;
}
  

async function queryAllProductsPrice(categoryId, priceSearch) {
	const products = await prisma.product.findMany({
		where:{
			product_categories_id: categoryId? categoryId : undefined,
			product_item:{
				some:{
					price:priceSearch
				}
			}
		},
		include: {
			product_item: {
				select: {
					price: true,
					amount: true
				}
			}
		}
	})
	return products;
}

export { queryAllProducts, queryAllProductsPrice }
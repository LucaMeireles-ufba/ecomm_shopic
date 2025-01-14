'use server'

import { prisma } from '@/utils/prisma'
import { redirect } from 'next/navigation'

export async function getNameDB() {
	return await prisma.option.findFirst({
		where: {
			key: 'name',
		},
	})
}

export async function getContactDB() {
	return await prisma.option.findMany({
		where: {
			OR: [
				{
					key: 'name'
				},
				{
					key: 'email'	
				}
			]
		},
	})
}

export async function getHidePricesDB() {
	return await prisma.option.findFirst({
		where: {
			key: 'hidePrices',
		},
	})
}

export async function getAllOptions() {
	return await prisma.option.findMany({})
}

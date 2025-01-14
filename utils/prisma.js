import { PrismaClient } from "@prisma/client"


if (!global.prisma) {
    global.prisma = new PrismaClient()
}

/**
 * @type {PrismaClient}
 */
export let prisma = global.prisma
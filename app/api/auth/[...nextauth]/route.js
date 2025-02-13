import NextAuth from 'next-auth/next'
import Email from 'next-auth/providers/email'
import { prisma } from '@/utils/prisma'
import { getServerSession } from "next-auth/next"

function PrismaAdapter(p) {
    return {
        createUser: (data) => p.user.create({ data }),
        getUser: (id) => p.user.findUnique({ where: { id } }),
        getUserByEmail: (email) => p.user.findUnique({ where: { email } }),
        async getUserByAccount(provider_providerAccountId) {
            var _a;
            const account = await p.account.findUnique({
                where: { provider_providerAccountId },
                select: { user: true },
            });
            return (_a = account === null || account === void 0 ? void 0 : account.user) !== null && _a !== void 0 ? _a : null;
        },
        updateUser: ({ id, ...data }) => p.user.update({ where: { id }, data }),
        deleteUser: (id) => p.user.delete({ where: { id } }),
        linkAccount: (data) => p.account.create({ data }),
        unlinkAccount: (provider_providerAccountId) => p.account.delete({
            where: { provider_providerAccountId },
        }),
        async getSessionAndUser(sessionToken) {
            const userAndSession = await p.session.findUnique({
                where: { sessionToken },
                include: { user: true },
            });
            if (!userAndSession)
                return null;
            const { user, ...session } = userAndSession;
            return { user, session };
        },
        createSession: (data) => p.session.create({ data }),
        updateSession: (data) => p.session.update({ where: { sessionToken: data.sessionToken }, data }),
        deleteSession: (sessionToken) => p.session.deleteMany({ where: { sessionToken } }),
        async createVerificationToken(data) {
            const verificationToken = await p.verificationToken.create({ data });
            // @ts-expect-errors // MongoDB needs an ID, but we don't
            if (verificationToken.id)
                delete verificationToken.id;
            return verificationToken;
        },
        async useVerificationToken(identifier_token) {
            try {
                const verificationToken = await p.verificationToken.delete({
                    where: { identifier_token },
                });
                // @ts-expect-errors // MongoDB needs an ID, but we don't
                if (verificationToken.id)
                    delete verificationToken.id;
                return verificationToken;
            }
            catch (error) {
                // If token already used/deleted, just return null
                // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
                if (error.code === "P2025")
                    return null;
                throw error;
            }
        },
    };
}

export const authOptions = {
    providers: [
        Email({
            server: {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
            type: "email",
            name: "Email Sign-in",
            from: process.env.EMAIL_FROM,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    theme: {
        colorScheme: "light",
        buttonText: "#ffffff",
        brandColor: "#000000",
        logo: '/static/images/logo.png'
    },
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.user.id = user.id
            session.user.name = user.name
            session.user.role = user.role

            return session
        }
    },
    events: {
        createUser(msg) {
            prisma.user.count().then((c) => {
                if (c <= 1)
                    prisma.user.update({
                        where: {
                            id: msg.user.id
                        },
                        data: {
                            role: "admin"
                        }
                    })
            })
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export function getServerSession() {
    return getServerSession(authOptions)
}
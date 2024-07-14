import NextAuth, { Account, Profile, User } from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";


const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ],
    callbacks: {
        authorized({ auth }: any) {
            return !!auth?.user
        },
        async signIn({ user }: any) {
            try {
                if (user?.email && user?.name) {
                    const existingGuest = await getGuest(user.email);

                    if (!existingGuest) {
                        await createGuest({ email: user.email, fullName: user.name })
                    }
                }

                return true;
            } catch (error) {
                return false;
            }
        },
        async session({session, user}:any) {
            try {
                const guest = await getGuest(session.user.email);
                if (!guest?.id) throw new Error("Error while logging in")
                session.user.guestId = guest.id
                return session
            } catch {
                return false;
            }
        }
    },
    pages: {
        signIn: "/login"
    }
}


export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(authConfig)
import NextAuth, {
    type NextAuthResult,
    type DefaultSession,
    type User
} from "next-auth";
import { type JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
    }

    interface User {
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
    }
}

const result = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        // signIn only gates access — returns true/false.
        // Data CANNOT be passed to jwt by mutating `user` here in NextAuth v5;
        // `user` in jwt is a fresh profile object, not the same reference.
        async signIn({ account }) {
            if (account?.provider === "google") {
                return !!account.access_token;
            }
            return false;
        },
        async jwt({ token, account }) {
            // `account` is ONLY present on the very first sign-in.
            // This is the correct place to do the Django token exchange.
            if (account?.provider === "google" && account.access_token) {
                try {
                    const baseUrl =
                        process.env.API_BASE_URL || "http://localhost:8000";
                    console.log(
                        `Connecting to Django at: ${baseUrl}/api/v1/auth/google/`
                    );

                    const response = await fetch(
                        `${baseUrl}/api/v1/auth/google/`,
                        {
                            method: "POST",
                            body: JSON.stringify({
                                access_token: account.access_token
                            }),
                            headers: { "Content-Type": "application/json" }
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Django Auth Success");
                        // dj-rest-auth + SimpleJWT returns { access, refresh, user: { pk } }
                        token.sub = String(data.user.pk);
                        token.accessToken = data.access;
                        token.refreshToken = data.refresh;
                    } else {
                        const errorText = await response.text();
                        console.error(
                            "Django Auth Failed:",
                            response.status,
                            errorText
                        );
                        token.error = "DjangoAuthError";
                    }
                } catch (error) {
                    console.error("Error during jwt callback:", error);
                    token.error = "DjangoAuthError";
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt"
    }
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const authResult = NextAuth({
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
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        try {
          const baseUrl = process.env.API_BASE_URL || "http://localhost:8000";
          const response = await fetch(`${baseUrl}/api/v1/auth/google/`, {
            method: "POST",
            body: JSON.stringify({ access_token: account.access_token }),
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            const data = await response.json();
            // Attach Django's JWT to the Auth.js user object
            // @ts-ignore - we are adding custom fields
            user.accessToken = data.access;
            // @ts-ignore
            user.refreshToken = data.refresh;
            return true;
          } else {
             console.error("Django Auth Failed:", await response.text());
          }
        } catch (error) {
          console.error("Error during signIn callback:", error);
        }
      }
      return false; // Fail login if not google or django auth fails
    },
    async jwt({ token, user, account }) {
      // User is only available on first sign in
      if (user && account?.provider === "google") {
        // @ts-ignore
        token.accessToken = user.accessToken;
        // @ts-ignore
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the Django access token to the client
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Optional custom login page path
  },
  session: {
    strategy: "jwt",
  },
})

// Explicit exports to avoid TS1274 / TS2742 "inferred type cannot be named" in pnpm workspaces
export const handlers = authResult.handlers as any;
export const signIn = authResult.signIn as any;
export const signOut = authResult.signOut as any;
export const auth = authResult.auth as any;

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { adminDb } from "@/lib/firebase-admin";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Authenticate with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error("Please verify your email before logging in");
          }

          // Create or update user document in Firestore
          // This ensures the user document exists after email verification
          const userDocRef = adminDb.collection("users").doc(user.uid);
          const userDoc = await userDocRef.get();

          if (!userDoc.exists) {
            // Create the user document if it doesn't exist
            await userDocRef.set({
              email: user.email,
              createdAt: new Date().toISOString(),
              emailVerified: true,
            });
          }

          // Return user object for NextAuth session
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
          };
        } catch (error: unknown) {
          // Handle Firebase auth errors
          if (error instanceof Error) {
            // Check for specific Firebase error codes
            const errorMessage = error.message;

            if (errorMessage.includes("auth/user-not-found")) {
              throw new Error("No account found with this email");
            }
            if (errorMessage.includes("auth/wrong-password")) {
              throw new Error("Incorrect password");
            }
            if (errorMessage.includes("auth/invalid-email")) {
              throw new Error("Invalid email address");
            }
            if (errorMessage.includes("auth/too-many-requests")) {
              throw new Error("Too many failed attempts. Please try again later");
            }
            // Pass through our custom error messages
            if (errorMessage.includes("verify your email")) {
              throw error;
            }
          }

          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to the token on first sign in
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

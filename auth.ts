import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // ✅ Don’t redefine providers here — they’re already in auth.config.ts
  providers: authConfig.providers.map((provider) => {
    if (provider.id === "credentials") {
      // Override authorize logic for credentials provider
      return {
        ...provider,
        async authorize(credentials: any) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) return null;

            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) return user;
          }

          console.log("Invalid credentials");
          return null;
        },
      };
    }
    return provider;
  }),
});

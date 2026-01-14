import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your secure dashboard
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Successfully Authenticated
              </CardTitle>
              <CardDescription>
                You are currently logged in and viewing a protected route.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Logged in as:</p>
                  <p className="font-semibold">{session.user?.email}</p>
                </div>
              </div>

              <LogoutButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How This Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This dashboard is protected by Next.js middleware. When you
                logged in via Firebase, NextAuth created a secure JWT session.
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>Firebase handles user authentication and email verification</li>
                <li>NextAuth manages sessions with encrypted JWT tokens</li>
                <li>Middleware checks your session before allowing access</li>
                <li>Your user data is stored securely in Firestore</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSession, logout } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, CheckCircle } from "lucide-react";

async function handleLogout() {
  "use server";
  await logout();
  redirect("/");
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
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
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Logged in as:</p>
                  <p className="font-semibold">{session.email}</p>
                </div>
              </div>

              <form action={handleLogout}>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How This Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This dashboard is protected by Next.js middleware. When you logged in, a secure httpOnly session cookie was created.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Middleware checks your session before allowing access</li>
                <li>Sessions are encrypted using iron-session</li>
                <li>Cookies are httpOnly and secure in production</li>
                <li>Unauthenticated users are redirected to login</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

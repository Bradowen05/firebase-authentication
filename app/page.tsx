import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Lock, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-primary">Basic Auth</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple and secure authentication demo built with Next.js 15,
              showcasing modern authentication patterns with session management.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">View Dashboard</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Session-based authentication with httpOnly cookies for maximum security.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Protected Routes</h3>
              <p className="text-muted-foreground">
                Middleware-based route protection ensures only authenticated users can access protected pages.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Zap className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Modern Stack</h3>
              <p className="text-muted-foreground">
                Built with Next.js 15, TypeScript, Tailwind CSS, and ShadCN UI components.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

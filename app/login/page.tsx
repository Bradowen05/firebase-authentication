import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <LoginForm />
      </main>

      <Footer />
    </div>
  );
}

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4">
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
}

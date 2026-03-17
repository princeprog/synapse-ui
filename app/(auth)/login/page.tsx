import type { Metadata } from "next";

import AuthSidePanel from "@/components/auth/AuthSidePanel";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Synapse",
  description: "Sign in to your Synapse account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#EBF1FB]" suppressHydrationWarning>
      <div className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden shadow-none">
        <LoginForm />
        <AuthSidePanel />
      </div>
    </div>
  );
}

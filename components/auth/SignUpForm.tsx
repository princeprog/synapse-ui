"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { useRegisterMutation } from "@/hooks/mutation/auth/useRegisterMutation";

export default function SignUpForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutate: register, isPending, error } = useRegisterMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setFormError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    register(
      { username, email, password },
      {
        onSuccess: () => {
          setSuccessMessage("Registration successful. Redirecting to login...");
          setTimeout(() => {
            router.push("/login");
          }, 700);
        },
      },
    );
  };

  const errorMessage = formError || (error instanceof Error ? error.message : null);

  return (
    <div className="flex-1 bg-white flex items-center justify-center px-8 py-14 md:px-14 lg:px-20">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">Start organizing your work with your details.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              required
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <Label htmlFor="terms" className="cursor-pointer select-none text-sm text-slate-500 font-normal pt-1 leading-normal items-start">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-0.5 border-slate-300 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white"
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Privacy Policy
              </Link>
              .
            </span>
          </Label>

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-sm text-green-700" role="status">
              {successMessage}
            </p>
          )}

          <Button
            id="signup-btn"
            type="submit"
            variant="auth"
            size="auth"
            disabled={isPending}
            className="w-full h-11 bg-blue-700 hover:bg-blue-600 text-white text-base font-semibold"
          >
            {isPending ? "Creating account..." : "Sign up"}
          </Button>

          <Button
            id="google-signup"
            type="button"
            variant="authOutline"
            size="auth"
            className="w-full font-medium gap-2"
          >
            <span aria-hidden="true" className="text-base leading-none font-semibold text-slate-900">
              G
            </span>
            Sign up with Google
          </Button>
        </form>

        <p className="mt-8 text-sm text-slate-500 text-center">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

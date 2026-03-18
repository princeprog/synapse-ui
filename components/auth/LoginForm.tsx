"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { useLoginMutation } from "@/hooks/mutation/useLoginMutation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLoginMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login(
      { username, password },
      {
        onSuccess: () => {
          router.push("/workspace");
        },
      },
    );
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="flex-1 bg-white flex items-center justify-center px-8 py-14 md:px-14 lg:px-20">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Please enter your details.
          </p>
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
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-between text-sm pt-1">
            <Label htmlFor="remember-me" className="cursor-pointer select-none text-slate-500 font-normal">
              <Checkbox
                id="remember-me"
                className="border-slate-300 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white"
              />
              Remember me
            </Label>
            <Link href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              Forgot password
            </Link>
          </div>

          <Button
            id="login-btn"
            type="submit"
            variant="auth"
            size="auth"
            disabled={isPending}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <Button
            id="google-login"
            type="button"
            variant="authOutline"
            size="auth"
            className="w-full font-medium gap-2"
          >
            <span aria-hidden="true" className="text-base leading-none font-semibold text-slate-900">
              G
            </span>
            Sign in with Google
          </Button>
        </form>

        <p className="mt-8 text-sm text-slate-500 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Sign up for free!
          </Link>
        </p>
      </div>
    </div>
  );
}

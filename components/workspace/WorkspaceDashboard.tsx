"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  Cloud,
  Globe,
  Plus,
  ShieldCheck,
  UserRound,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/common/button";
import { useLogoutMutation } from "@/hooks/mutation/useLogoutMutation";
import ThemeToggleButton from "@/components/workspace/ThemeToggleButton";

type Role = "Admin" | "Member" | "Guest";

type WorkspaceItem = {
  name: string;
  description: string;
  members: number;
  role: Role;
  icon: LucideIcon;
  href: string;
};

const workspaces: WorkspaceItem[] = [
  {
    name: "Product Design",
    description: "Core UI/UX team focusing on the 2026 redesign and component library.",
    members: 12,
    role: "Admin",
    icon: BriefcaseBusiness,
    href: "#",
  },
  {
    name: "Engineering Hub",
    description: "Backend architecture, API documentation, and infrastructure scaling.",
    members: 28,
    role: "Member",
    icon: Zap,
    href: "#",
  },
  {
    name: "Marketing Ops",
    description: "Global campaign management, asset libraries, and social coordination.",
    members: 8,
    role: "Member",
    icon: Globe,
    href: "#",
  },
  {
    name: "Executive Strategy",
    description: "Q4 roadmaps, board meetings, and high-level initiative tracking.",
    members: 5,
    role: "Guest",
    icon: ShieldCheck,
    href: "#",
  },
  {
    name: "Cloud Infrastructure",
    description: "DevOps, SRE, and cloud resource management for production clusters.",
    members: 14,
    role: "Admin",
    icon: Cloud,
    href: "#",
  },
];

const highlights = [
  {
    title: "Switching Teams",
    description:
      "Easily toggle between your organizations using the workspace switcher in top navigation.",
  },
  {
    title: "Security First",
    description:
      "All workspaces are encrypted. Manage granular permissions in the workspace administration panel.",
  },
  {
    title: "Need help?",
    description:
      "Documentation covers everything from onboarding to advanced file management strategies.",
  },
];

const roleStyles: Record<Role, string> = {
  Admin:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  Member:
    "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  Guest:
    "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
};

export default function WorkspaceDashboard() {
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EBF1FB] transition-colors dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="mx-auto flex h-16 w-full max-w-350 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-2.5">
            <Image
              src="/synapse-logo2.png"
              alt="Synapse logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <span className="text-base font-semibold tracking-tight text-blue-600 dark:text-blue-400">
              Synapse
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <ThemeToggleButton />
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Help"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              aria-label="Profile"
            >
              <UserRound className="h-4 w-4" />
            </button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="ml-1"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-350 flex-1 px-6 py-12 md:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 lg:text-5xl">
            Welcome back, Felix
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Select a workspace to continue collaborating with your team, or start a new project
            from scratch.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;

            return (
              <article
                key={workspace.name}
                className="min-h-65 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-none lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${roleStyles[workspace.role]}`}
                  >
                    {workspace.role}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                  {workspace.name}
                </h2>
                <p className="mt-2 min-h-16 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {workspace.description}
                </p>

                <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {workspace.members} members
                    </span>
                    <Link
                      href={workspace.href}
                      className="inline-flex items-center gap-1.5 font-semibold text-slate-700 transition-colors hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-400"
                    >
                      Enter
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          <article className="flex min-h-65 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900 lg:p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Plus className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              New Workspace
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Create a new team environment or join via invite code.
            </p>
            <Button
              type="button"
              variant="auth"
              size="auth"
              className="mt-6 h-11 w-full bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
            >
              Create or Join
            </Button>
          </article>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-7 dark:border-slate-800">
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title}>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex w-full max-w-350 flex-col items-center justify-between gap-3 px-6 py-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row md:px-8">
          <p>© 2026 Synapse. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-700 dark:hover:text-slate-100">
              Status
            </Link>
            <Link href="#" className="hover:text-slate-700 dark:hover:text-slate-100">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-700 dark:hover:text-slate-100">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
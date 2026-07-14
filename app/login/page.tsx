/**
 * Page/Route: page.tsx
 */
import Link from "next/link";
import { login } from "./actions";
import { DemoAccountCard } from "@/components/DemoAccountCard";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";

export default async function LoginPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;
  const message = searchParams?.message as string | undefined;

  return (
    <div className="flex-1 flex flex-col bg-(--color-canvas-dark) text-(--color-on-dark) justify-center py-6 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-(--color-primary)/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-(--color-primary-active)/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <h2 className="text-[28px] md:text-[32px] tracking-tight text-(--color-on-dark) font-bold mb-1 text-center">
          Welcome Back
        </h2>

        <p className="text-center text-body-md text-(--color-muted)">
          Enter your credentials to access Tharvion
        </p>
        <p className="mt-2 text-center text-caption uppercase tracking-[.18em] text-(--color-primary)">
          Know your money. Own your future.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up stagger-1">
        <div className="bg-(--color-surface-card-dark)/80 backdrop-blur-xl py-6 md:py-8 px-5 border border-(--color-hairline-on-dark) sm:rounded-2xl sm:px-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-body-sm backdrop-blur-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-body-sm backdrop-blur-sm">
              {message}
            </div>
          )}
          <form className="space-y-6" action={login}>
            <div>
              <label
                htmlFor="email"
                className="block text-body-sm font-medium text-(--color-on-dark) mb-1.5"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/50 px-4 py-3 text-(--color-on-dark) placeholder-(--color-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) sm:text-body-md transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-body-sm font-medium text-(--color-on-dark) mb-1.5"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full appearance-none rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/50 px-4 py-3 text-(--color-on-dark) placeholder-(--color-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) sm:text-body-md transition-all"
                  placeholder="........"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-body-sm">
              <label className="flex items-center gap-2 text-(--color-muted)">
                <input type="hidden" name="remember" value="off" />
                <input
                  type="checkbox"
                  name="remember"
                  value="on"
                  defaultChecked
                  className="h-4 w-4 rounded border-(--color-hairline-on-dark) accent-(--color-primary)"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-(--color-primary) hover:text-(--color-primary-active) transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div>
              <AuthSubmitButton pendingText="Logging in...">Log in</AuthSubmitButton>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-(--color-hairline-on-dark)" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-(--color-surface-card-dark) px-4 text-(--color-muted)">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center text-body-md text-(--color-muted)">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-(--color-primary) hover:text-(--color-primary-active) font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>

          <DemoAccountCard />
        </div>
      </div>
    </div>
  );
}

/**
 * Page/Route: page.tsx
 */
import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;
  const message = searchParams?.message as string | undefined;

  return (
    <div className="flex-1 flex flex-col bg-(--color-canvas-dark) text-(--color-on-dark) justify-center py-6 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <h2 className="text-[28px] md:text-[32px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 font-bold mb-1 text-center">
          Create an Account
        </h2>
        <p className="text-center text-body-md text-(--color-muted)">
          Join us and start tracking your expenses
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
          <form className="space-y-6" action={signup}>
            <div>
              <label
                htmlFor="name"
                className="block text-body-sm font-medium text-(--color-on-dark) mb-1.5"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full appearance-none rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/50 px-4 py-3 text-(--color-on-dark) placeholder-(--color-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) sm:text-body-md transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="block w-full appearance-none rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/50 px-4 py-3 text-(--color-on-dark) placeholder-(--color-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) sm:text-body-md transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-caption text-(--color-muted)">Minimum 6 characters</p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-4 text-button text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-(--color-canvas-dark) transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign up
              </button>
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


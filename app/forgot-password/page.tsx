/**
 * Page/Route: page.tsx
 */
import Link from "next/link";
import { sendPasswordReset } from "./actions";

export default async function ForgotPasswordPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;

  return (
    <div className="flex-1 flex flex-col bg-(--color-canvas-dark) text-(--color-on-dark) justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <h2 className="text-[28px] md:text-[32px] tracking-tight text-(--color-on-dark) font-bold mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-center text-body-md text-(--color-muted)">
          Enter your email and Supabase will send the reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up stagger-1">
        <div className="bg-(--color-surface-card-dark)/90 backdrop-blur-xl py-6 md:py-8 px-5 border border-(--color-hairline-on-dark) rounded-2xl sm:px-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-body-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" action={sendPasswordReset}>
            <div>
              <label
                htmlFor="email"
                className="block text-body-sm font-medium text-(--color-on-dark) mb-1.5"
              >
                Email address
              </label>
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

            <button
              type="submit"
              className="flex w-full justify-center rounded-xl border border-transparent bg-(--color-primary) py-3 px-4 text-button text-(--color-on-primary) shadow-lg shadow-(--color-primary)/20 hover:bg-(--color-primary-active) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all"
            >
              Send Reset Email
            </button>
          </form>

          <div className="mt-6 text-center text-body-sm text-(--color-muted)">
            Remembered it?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Back to log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

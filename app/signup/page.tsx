import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;
  const message = searchParams?.message as string | undefined;

  return (
    <div className="flex-1 flex flex-col bg-(--color-canvas-light) text-(--color-ink) justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-display-sm text-center text-(--color-ink)">Create an Account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-(--color-canvas-light) py-8 px-4 border border-(--color-hairline-on-light) sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-body-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-body-sm">
              {message}
            </div>
          )}
          <form className="space-y-6" action={signup}>
            <div>
              <label htmlFor="email" className="block text-body-md text-(--color-ink)">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-(--color-hairline-on-light) bg-(--color-canvas-light) px-3 py-2 text-(--color-ink) placeholder-(--color-muted) focus:border-(--color-info) focus:outline-none focus:ring-(--color-info-ring) sm:text-body-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-body-md text-(--color-ink)">
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
                  className="block w-full appearance-none rounded-md border border-(--color-hairline-on-light) bg-(--color-canvas-light) px-3 py-2 text-(--color-ink) placeholder-(--color-muted) focus:border-(--color-info) focus:outline-none focus:ring-(--color-info-ring) sm:text-body-md"
                />
              </div>
              <p className="mt-1 text-caption text-(--color-muted)">Minimum 6 characters</p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-(--color-primary) py-2 px-4 text-button text-(--color-on-primary) shadow-sm hover:bg-(--color-primary-active) focus:outline-none focus:ring-2 focus:ring-(--color-info-ring) focus:ring-offset-2"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-(--color-hairline-on-light)" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-(--color-canvas-light) px-2 text-muted">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center text-body-md text-(--color-ink)">
              Already have an account?{" "}
              <Link href="/login" className="text-(--color-primary) hover:text-(--color-primary-active) font-medium">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


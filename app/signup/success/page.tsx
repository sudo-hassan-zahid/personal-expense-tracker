/**
 * Page/Route: page.tsx
 */
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function SignupSuccessPage() {
  return (
    <div className="flex-1 flex flex-col bg-(--color-canvas-dark) text-(--color-on-dark) justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 backdrop-blur-sm">
            <MailCheck size={48} />
          </div>
        </div>

        <h2 className="text-[32px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 font-bold mb-4">
          Check your email
        </h2>

        <div className="bg-(--color-surface-card-dark)/80 backdrop-blur-xl py-8 px-4 border border-(--color-hairline-on-dark) sm:rounded-2xl sm:px-10 shadow-2xl">
          <p className="text-body-md text-(--color-on-dark) mb-6">
            We&apos;ve sent a confirmation link to your email address. Please click the link to
            activate your account.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-4 text-button text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              Back to Login
            </Link>

            <p className="text-caption text-(--color-muted)">
              Didn&apos;t receive the email? Check your spam folder or try signing up again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


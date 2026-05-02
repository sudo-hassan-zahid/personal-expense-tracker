import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-[80px] flex flex-col gap-[80px]">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 pt-[40px]">
        <h1 className="text-hero-display text-(--color-on-dark)">
          Take Control of Your <span className="text-(--color-primary)">Finances</span>
        </h1>
        <p className="text-title-lg text-(--color-body) max-w-[800px]">
          Track your income, monitor your expenses, and grow your net worth with the most powerful personal expense tracker.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Link
            href="/signup"
            className="bg-(--color-primary) text-(--color-on-primary) text-button px-[32px] py-[14px] rounded-full hover:bg-(--color-primary-active) transition-colors"
          >
            Get Started Now
          </Link>
          <Link
            href="/login"
            className="bg-(--color-surface-card-dark) text-(--color-on-dark) text-button px-[24px] py-[12px] rounded-md hover:bg-(--color-surface-elevated-dark) transition-colors"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-(--color-canvas-dark) py-[80px] flex flex-col items-center">
        <h2 className="text-display-lg text-(--color-primary) mb-12">
          RECORDS ARE SECURE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div>
            <div className="text-number-display text-(--color-primary)">256-bit</div>
            <div className="text-title-sm text-(--color-muted) mt-2">Encryption standard</div>
          </div>
          <div>
            <div className="text-number-display text-(--color-primary)">100%</div>
            <div className="text-title-sm text-(--color-muted) mt-2">Data ownership</div>
          </div>
          <div>
            <div className="text-number-display text-(--color-primary)">24/7</div>
            <div className="text-title-sm text-(--color-muted) mt-2">Uptime reliability</div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-(--color-surface-card-dark) rounded-xl p-[48px] flex flex-col md:flex-row items-center justify-between mt-[40px]">
        <div>
          <h2 className="text-display-sm text-(--color-on-dark)">
            Start tracking for free today.
          </h2>
          <p className="text-body-md text-(--color-muted) mt-2">
            No credit card required. Join thousands of users managing their wealth.
          </p>
        </div>
        <Link
          href="/signup"
          className="bg-(--color-primary) text-(--color-on-primary) text-button px-[24px] h-[40px] rounded-md flex items-center justify-center hover:bg-(--color-primary-active) transition-colors mt-6 md:mt-0 whitespace-nowrap"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}

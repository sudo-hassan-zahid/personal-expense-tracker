import Link from "next/link";
import { createClient } from "@/lib/supabase";

export async function TopNav() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <header className="h-[64px] bg-(--color-canvas-dark) flex items-center justify-between px-6 shrink-0 border-b border-(--color-hairline-on-dark)">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight hover:text-primary-active transition-colors">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.8l5.2 5.2-5.2 5.2-5.2-5.2L12 6.8z" />
          </svg>
          <span className="text-(--color-primary)">TRACKER</span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-nav-link text-(--color-body) hover:text-(--color-primary) transition-colors">Dashboard</Link>
            <Link href="/dashboard/profile" className="text-nav-link text-(--color-body) hover:text-(--color-primary) transition-colors">Profile</Link>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <form action="/auth/signout" method="post">
            <button className="text-button text-(--color-body) hover:text-(--color-primary) bg-transparent">Log Out</button>
          </form>
        ) : (
          <>
            <Link href="/login" className="text-button text-(--color-body) hover:text-(--color-primary)">Log In</Link>
            <Link href="/signup" className="text-button bg-(--color-primary) text-(--color-on-primary) px-[24px] h-[40px] rounded-md flex items-center justify-center hover:bg-(--color-primary-active) transition-colors">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

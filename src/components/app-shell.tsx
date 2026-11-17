import Link from "next/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { SignOutButton } from "@/components/sign-out-button";

export function AppShell({
  locale,
  t,
  email,
  children,
}: {
  locale: Locale;
  t: Dictionary;
  email?: string | null;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/projects">
          {t.brand}
        </Link>
        <div className="topbar-actions">
          {email ? <span className="badge">{email}</span> : null}
          <LocaleSwitcher locale={locale} label={t.language} />
          <SignOutButton label={t.signOut} />
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}

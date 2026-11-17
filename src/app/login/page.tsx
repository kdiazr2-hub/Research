import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="hero-auth">
      <div className="auth-panel">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h1>{t.brand}</h1>
            <p className="lede">{t.tagline}</p>
          </div>
          <LocaleSwitcher locale={locale} label={t.language} />
        </div>
        <LoginForm
          labels={{
            email: t.email,
            password: t.password,
            signIn: t.signIn,
            register: t.register,
            error: t.error,
          }}
        />
        <p className="hint">{t.demoHint}</p>
      </div>
    </div>
  );
}

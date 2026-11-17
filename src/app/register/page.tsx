import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="hero-auth">
      <div className="auth-panel">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h1>{t.register}</h1>
            <p className="lede">{t.brand}</p>
          </div>
          <LocaleSwitcher locale={locale} label={t.language} />
        </div>
        <RegisterForm
          labels={{
            name: t.name,
            email: t.email,
            password: t.password,
            createAccount: t.createAccount,
            login: t.login,
            error: t.error,
          }}
        />
      </div>
    </div>
  );
}

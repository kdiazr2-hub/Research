"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm({
  labels,
}: {
  labels: {
    name: string;
    email: string;
    password: string;
    createAccount: string;
    login: string;
    error: string;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setPending(false);
      setError(labels.error);
      return;
    }

    const sign = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    setPending(false);
    if (sign?.error) {
      setError(labels.error);
      return;
    }
    router.push("/projects");
    router.refresh();
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <label>
        {labels.name}
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        {labels.email}
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        {labels.password}
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={pending}>
        {labels.createAccount}
      </button>
      <Link href="/login">{labels.login}</Link>
    </form>
  );
}

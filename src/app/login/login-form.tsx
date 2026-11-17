"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm({
  labels,
}: {
  labels: {
    email: string;
    password: string;
    signIn: string;
    register: string;
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
    const res = await signIn("credentials", {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError(labels.error);
      return;
    }
    router.push("/projects");
    router.refresh();
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
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
          autoComplete="current-password"
          minLength={8}
        />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={pending}>
        {labels.signIn}
      </button>
      <Link href="/register">{labels.register}</Link>
    </form>
  );
}

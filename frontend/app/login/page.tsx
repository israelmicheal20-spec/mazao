"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("secret123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Login failed");

      localStorage.setItem("mazao_token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1>Login</h1>
        <p style={styles.subtitle}>Access your farmer dashboard</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>

        <p style={styles.footerText}>
          No account? <Link href="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f4fbf6 0%, #e9f6ee 100%)",
    padding: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "440px",
    padding: "28px",
    boxShadow: "0 18px 36px rgba(18, 62, 48, 0.08)",
  },
  subtitle: {
    color: "#547062",
    marginTop: "8px",
    marginBottom: "18px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d7ddd9",
  },
  button: {
    background: "#1a8f5d",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "10px",
  },
  footerText: {
    marginTop: "20px",
    color: "#49615c",
  },
  error: {
    color: "#b83d3d",
    marginTop: "8px",
  },
};

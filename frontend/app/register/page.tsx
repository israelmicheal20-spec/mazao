"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("John Kibet");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("0712345678");
  const [password, setPassword] = useState("secret123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          password,
          role: "farmer",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Registration failed");

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1>Create account</h1>
        <p style={styles.subtitle}>Join Mazao and start verifying produce</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <label>Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={styles.input} />

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

          <label>Phone number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating..." : "Register"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link href="/login">Login</Link>
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
    padding: "24px",
    background: "linear-gradient(135deg, #f4fbf6 0%, #e9f6ee 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 18px 36px rgba(18, 62, 48, 0.08)",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: "18px",
    color: "#536e62",
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
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "10px",
  },
  footerText: {
    color: "#49615c",
    marginTop: "20px",
  },
  error: {
    color: "#b83d3d",
    marginTop: "8px",
  },
};

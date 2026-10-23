"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [crop, setCrop] = useState("Potato");
  const [harvestDate, setHarvestDate] = useState("2026-10-01");
  const [temperature, setTemperature] = useState("28");
  const [humidity, setHumidity] = useState("62");
  const [sunlight, setSunlight] = useState("3");
  const [storage, setStorage] = useState("Shade with ventilation");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleQuickCheck(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("crop_name", crop);
      formData.append("harvest_date", harvestDate);
      formData.append("temperature_c", temperature);
      formData.append("humidity_percent", humidity);
      formData.append("sunlight_hours", sunlight);
      formData.append("storage_method", storage);
      if (file) formData.append("file", file);

      const response = await fetch("http://localhost:8000/produce/quality-check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("mazao_token") || ""}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Request failed");

      setResult(data.data);
    } catch (err: any) {
      setError(err.message || "Could not check produce");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.brand}>Mazao AI</div>
        <div style={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/marketplace">Marketplace</Link>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.heroText}>
          <span style={styles.badge}>Smart produce verification</span>
          <h1>Verify freshness before the market takes it.</h1>
          <p>
            Mazao helps farmers understand produce shelf life, spoilage risk, and storage quality using images, harvest timing, and storage conditions.
          </p>

          <div style={styles.ctaRow}>
            <Link href="/register" style={styles.primaryBtn}>Get started</Link>
            <Link href="/marketplace" style={styles.secondaryBtn}>View marketplace</Link>
          </div>
        </div>

        <div style={styles.formCard}>
          <h3>Quick quality check</h3>
          <form onSubmit={handleQuickCheck} style={styles.form}>
            <label>Crop</label>
            <input value={crop} onChange={(e) => setCrop(e.target.value)} style={styles.input} />

            <label>Harvest date</label>
            <input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} style={styles.input} />

            <label>Temperature (°C)</label>
            <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} style={styles.input} />

            <label>Humidity (%)</label>
            <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} style={styles.input} />

            <label>Sunlight hours</label>
            <input type="number" value={sunlight} onChange={(e) => setSunlight(e.target.value)} style={styles.input} />

            <label>Storage method</label>
            <input value={storage} onChange={(e) => setStorage(e.target.value)} style={styles.input} />

            <label>Upload image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={styles.fileInput} />

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Checking..." : "Analyze produce"}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>

      {result && (
        <section style={styles.resultSection}>
          <h2>Quality report</h2>
          <div style={styles.metricGrid}>
            <div style={styles.metricCard}>
              <span>Grade</span>
              <strong>{result.grade}</strong>
            </div>
            <div style={styles.metricCard}>
              <span>Freshness</span>
              <strong>{result.freshness_score}/100</strong>
            </div>
            <div style={styles.metricCard}>
              <span>Shelf life</span>
              <strong>{result.estimated_shelf_life_days} days</strong>
            </div>
            <div style={styles.metricCard}>
              <span>Risk</span>
              <strong>{result.spoilage_risk}%</strong>
            </div>
          </div>

          <div style={styles.adviceBox}>
            <h3>Storage advice</h3>
            <ul>
              {result.advice?.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3fbf5 0%, #eaf5f0 100%)",
    padding: "24px 28px 60px",
  },
  navbar: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 0",
  },
  brand: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0c7a42",
  },
  navLinks: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
    color: "#214c39",
    fontWeight: 600,
  },
  hero: {
    maxWidth: "1200px",
    margin: "30px auto",
    display: "grid",
    gridTemplateColumns: "1.15fr 1fr",
    gap: "24px",
    alignItems: "center",
  },
  heroText: {
    padding: "20px 0",
  },
  badge: {
    display: "inline-block",
    background: "#dff7e5",
    color: "#0d7d44",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 700,
    marginBottom: "20px",
  },
  formCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 18px 36px rgba(18, 62, 48, 0.08)",
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
    fontSize: "15px",
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #d7ddd9",
  },
  ctaRow: {
    display: "flex",
    gap: "12px",
    marginTop: "22px",
  },
  primaryBtn: {
    display: "inline-block",
    background: "#1a8f5d",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: "12px",
    fontWeight: 700,
  },
  secondaryBtn: {
    display: "inline-block",
    background: "#ebf7f0",
    color: "#175f3f",
    padding: "14px 18px",
    borderRadius: "12px",
    fontWeight: 700,
  },
  button: {
    background: "#1a8f5d",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    color: "#b83d3d",
    marginTop: "8px",
  },
  resultSection: {
    maxWidth: "1200px",
    margin: "15px auto 0",
    background: "#fff",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 18px 32px rgba(18, 62, 48, 0.08)",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(150px, 1fr))",
    gap: "16px",
    marginTop: "18px",
  },
  metricCard: {
    background: "#f6faf7",
    borderRadius: "12px",
    border: "1px solid #dfeae2",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  adviceBox: {
    marginTop: "20px",
    background: "#f8faf8",
    borderRadius: "12px",
    border: "1px solid #dfeae2",
    padding: "18px",
  },
};

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProducePage() {
  const router = useRouter();

  const [cropName, setCropName] = useState("Potato");
  const [harvestDate, setHarvestDate] = useState("2026-10-01");
  const [temperature, setTemperature] = useState("28");
  const [humidity, setHumidity] = useState("62");
  const [sunlight, setSunlight] = useState("3");
  const [storageMethod, setStorageMethod] = useState("Shade with ventilation");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("mazao_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("crop_name", cropName);
      formData.append("harvest_date", harvestDate);
      formData.append("temperature_c", temperature);
      formData.append("humidity_percent", humidity);
      formData.append("sunlight_hours", sunlight);
      formData.append("storage_method", storageMethod);
      if (file) formData.append("file", file);

      const response = await fetch("http://localhost:8000/produce/quality-check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Request failed");

      alert("Produce analyzed successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Could not analyze produce");
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
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/marketplace">Marketplace</Link>
        </div>
      </nav>

      <div style={styles.formContainer}>
        <h1>Analyze produce</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Crop</label>
          <input value={cropName} onChange={(e) => setCropName(e.target.value)} style={styles.input} />

          <label>Harvest date</label>
          <input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} style={styles.input} />

          <label>Temperature (°C)</label>
          <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} style={styles.input} />

          <label>Humidity (%)</label>
          <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} style={styles.input} />

          <label>Sunlight hours</label>
          <input type="number" value={sunlight} onChange={(e) => setSunlight(e.target.value)} style={styles.input} />

          <label>Storage method</label>
          <input value={storageMethod} onChange={(e) => setStorageMethod(e.target.value)} style={styles.input} />

          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={styles.fileInput} />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Checking..." : "Analyze produce"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#f4fbf6",
    padding: "20px 28px 50px",
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
    fontSize: "24px",
    fontWeight: 700,
    color: "#0d7a41",
  },
  navLinks: {
    display: "flex",
    gap: "18px",
    fontWeight: 600,
    color: "#204d39",
  },
  formContainer: {
    maxWidth: "760px",
    margin: "32px auto 0",
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 18px 32px rgba(18, 62, 48, 0.08)",
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
  fileInput: {
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #d7ddd9",
    background: "#fff",
  },
  button: {
    background: "#1a8f5d",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
  },
  error: {
    color: "#b83d3d",
    marginTop: "8px",
  },
};

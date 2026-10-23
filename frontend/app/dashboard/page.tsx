"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Batch = {
  id: number;
  crop_name: string;
  grade: string;
  freshness_score: number;
  spoilage_risk: number;
  estimated_shelf_life_days: number;
  advice: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mazao_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        const response = await fetch("http://localhost:8000/produce/my-batches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data?.detail || "Could not load batches");

        setBatches(data);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  function logout() {
    localStorage.removeItem("mazao_token");
    router.push("/login");
  }

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <main style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.brand}>Mazao AI</div>
        <div style={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/produce">Add produce</Link>
          <Link href="/marketplace">Marketplace</Link>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1>Farmer Dashboard</h1>
          <Link href="/produce" style={styles.primaryBtn}>Add produce</Link>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span>Harvests tracked</span>
            <strong>{batches.length}</strong>
          </div>
          <div style={styles.statCard}>
            <span>Fresh stock</span>
            <strong>{batches.length > 0 ? "76%" : "0%"}</strong>
          </div>
          <div style={styles.statCard}>
            <span>Average shelf life</span>
            <strong>
              {batches.length > 0
                ? `${Math.round(batches.reduce((sum, b) => sum + b.estimated_shelf_life_days, 0) / batches.length)} days`
                : "0 days"}
            </strong>
          </div>
          <div style={styles.statCard}>
            <span>Buyers reached</span>
            <strong>32</strong>
          </div>
        </div>

        <div style={styles.tableWrap}>
          <h3>Recent batches</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Grade</th>
                <th>Freshness</th>
                <th>Shelf life</th>
                <th>Advice</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={5}>No batches yet.</td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id}>
                    <td>{batch.crop_name}</td>
                    <td>{batch.grade}</td>
                    <td>{batch.freshness_score}/100</td>
                    <td>{batch.estimated_shelf_life_days} days</td>
                    <td>{batch.advice || "No advice yet"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    alignItems: "center",
    fontWeight: 600,
    color: "#204d39",
  },
  container: {
    maxWidth: "1200px",
    margin: "28px auto 0",
    background: "#fff",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 12px 24px rgba(20, 40, 28, 0.06)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  primaryBtn: {
    display: "inline-block",
    background: "#1a8f5d",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: 700,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(160px, 1fr))",
    gap: "18px",
  },
  statCard: {
    padding: "16px",
    background: "#f7faf8",
    border: "1px solid #dce9df",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  tableWrap: {
    marginTop: "24px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
  },
  logoutBtn: {
    border: "none",
    background: "#eaeaea",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
};

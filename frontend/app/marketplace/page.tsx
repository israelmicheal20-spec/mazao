"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Listing = {
  id: number;
  crop_name: string;
  price_per_kg: number;
  quantity_kg: number;
  location: string;
  status: string;
  seller_id: number;
};

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("http://localhost:8000/marketplace/");
        const data = await response.json();
        if (!response.ok) throw new Error(data?.detail || "Could not load marketplace");

        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function handleOrder(listing: Listing) {
    const token = localStorage.getItem("mazao_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/marketplace/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing_id: listing.id,
          quantity_kg: 10,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Request failed");

      alert("Order placed successfully!");
    } catch (err) {
      alert("Could not place order");
    }
  }

  if (loading) return <div style={styles.loading}>Loading marketplace...</div>;

  return (
    <main style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.brand}>Mazao AI</div>
        <div style={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/produce">Add produce</Link>
        </div>
      </nav>

      <div style={styles.container}>
        <h1>Marketplace</h1>

        <div style={styles.grid}>
          {listings.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.headerRow}>
                <span style={styles.cropBadge}>{item.crop_name}</span>
                <span>{item.location}</span>
              </div>

              <div style={styles.metaRow}>
                <div>
                  <small>Price</small>
                  <strong>KSh {item.price_per_kg.toLocaleString()}</strong>
                </div>
                <div>
                  <small>Quantity</small>
                  <strong>{item.quantity_kg} kg</strong>
                </div>
              </div>

              <div style={styles.metaRow}>
                <div>
                  <small>Status</small>
                  <strong>{item.status}</strong>
                </div>
                <div>
                  <small>Seller</small>
                  <strong>{item.seller_id}</strong>
                </div>
              </div>

              <button onClick={() => handleOrder(item)} style={styles.button}>
                Order now
              </button>
            </div>
          ))}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
    gap: "18px",
    marginTop: "20px",
  },
  card: {
    background: "#f8faf9",
    border: "1px solid #dfeae2",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cropBadge: {
    background: "#dff7e5",
    color: "#0e7a42",
    padding: "8px 10px",
    borderRadius: "999px",
    fontWeight: 700,
  },
  metaRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  button: {
    background: "#1a8f5d",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 14px",
    fontWeight: 700,
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

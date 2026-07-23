'use client';
import React from 'react';

interface LoginProps {
  inputPassword: string;
  setInputPassword: (val: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  loginError: string;
}

export default function LoginCard({ inputPassword, setInputPassword, handleLogin, loginError }: LoginProps) {
  return (
    <div style={{ backgroundColor: "#FBF9F6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#FFFFFF", padding: "3rem", borderRadius: "24px", border: "1px solid #F4EEE8", width: "100%", maxWidth: "440px", textAlign: "center" }}>
        <img src="/logo.png" alt="ANLUVIA" style={{ maxHeight: "80px", marginBottom: "1.5rem", objectFit: "contain" }} />
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginBottom: "2rem" }}>
          ACCESO AL PANEL EJECUTIVO
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {loginError ? (
            <div style={{ padding: "0.75rem", backgroundColor: "#FDF2F2", color: "#D93025", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600 }}>
              {loginError}
            </div>
          ) : null}

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
              Ingresa tu Clave de Colaborador:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              style={{ width: "100%", padding: "0.85rem", borderRadius: "12px", border: "1px solid #ccc", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
              required
            />
          </div>

          <button type="submit" style={{ backgroundColor: "#8B2434", color: "#FFFFFF", padding: "0.9rem", borderRadius: "9999px", border: "none", fontWeight: 700, cursor: "pointer" }}>
            Ingresar al Panel →
          </button>
        </form>

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #F4EEE8", fontSize: "0.75rem", color: "#666", textAlign: "left", lineHeight: "1.6" }}>
          🔐 <strong>Claves iniciales:</strong><br />
          • Admin: <code>anluvia2026</code><br />
          • Kinesiología: <code>kine2026</code><br />
          • Recepción: <code>recepcion2026</code><br />
          • Editor Web: <code>editor2026</code>
        </div>
      </div>
    </div>
  );
}
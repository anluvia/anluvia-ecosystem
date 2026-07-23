'use client';
import React from 'react';

export default function DashboardTab() {
  return (
    <div>
      <h1 style={{ fontSize: "2.25rem", margin: "0 0 2rem 0", fontFamily: "serif" }}>Indicadores de Negocio</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
        <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Ventas Brutas</span>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.3rem" }}>$0 CLP</div>
        </div>
        <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", textTransform: "uppercase" }}>Compras & Gastos</span>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#8B2434", marginTop: "0.3rem" }}>$0 CLP</div>
        </div>
        <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#137333", textTransform: "uppercase" }}>Ganancia Neta</span>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#137333", marginTop: "0.3rem" }}>$0 CLP</div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const servicios = [
    {
      titulo: "Kinesiología & Recuperación Física",
      tag: "Salud & Rehabilitación",
      descripcion: "Tratamiento personalizado para lesiones musculoesqueléticas, dolor crónico y rehabilitación post-quirúrgica.",
      precio: "$45.000 CLP",
      icono: "🩺"
    },
    {
      titulo: "Estética Facial Premium",
      tag: "Dermatofuncional",
      descripcion: "Armonización, limpieza profunda, peelings médicos y tratamientos anti-age con tecnología avanzada.",
      precio: "$55.000 CLP",
      icono: "✨"
    },
    {
      titulo: "Remodelación & Drenaje",
      tag: "Corporal",
      descripcion: "Drenaje linfático manual y aparatología para reducción de edema, post-operatorio y moldeo corporal.",
      precio: "$50.000 CLP",
      icono: "🌿"
    },
    {
      titulo: "Masoterapia Integral",
      tag: "Bienestar",
      descripcion: "Masajes descontracturantes y de relajación profunda para aliviar la tensión muscular y el estrés acumulado.",
      precio: "$40.000 CLP",
      icono: "🕊️"
    }
  ];

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "sans-serif", minHeight: "100vh" }}>
      {/* NAVEGACIÓN PRINCIPAL */}
      <header style={{ borderBottom: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "1.25rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <span style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "serif", letterSpacing: "0.05em", color: "#1F1F1F" }}>ANLUVIA</span>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700 }}>
            Clinique & Wellness
          </div>
        </div>

        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#servicios" style={{ color: "#4A4A4A", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Servicios</a>
          <a href="#nosotros" style={{ color: "#4A4A4A", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Nosotros</a>
          <Link href="/admin" style={{ color: "#7D8E7C", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, border: "1px solid #7D8E7C", padding: "0.4rem 1rem", borderRadius: "9999px" }}>
            Acceso Equipo
          </Link>
          <Link href="/reservar" style={{ backgroundColor: "#8B2434", color: "#FFFFFF", textDecoration: "none", padding: "0.65rem 1.5rem", borderRadius: "9999px", fontSize: "0.9rem", fontWeight: 700, boxShadow: "0 4px 12px rgba(139, 36, 52, 0.2)" }}>
            Agendar Cita Online →
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={{ padding: "6rem 3rem", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
        <span style={{ backgroundColor: "#F4EEE8", color: "#8B2434", padding: "0.4rem 1.25rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-block", marginBottom: "1.5rem" }}>
          Salud, Estética & Bienestar Integral
        </span>
        <h1 style={{ fontSize: "3.5rem", fontFamily: "serif", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.5rem", color: "#1F1F1F" }}>
          Recupera tu vitalidad y potencia tu belleza natural
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: 1.6, marginBottom: "2.5rem", maxWidth: "700px", margin: "0 auto 2.5rem auto" }}>
          En ANLUVIA combinamos la precisión de la kinesiología médica con las últimas tendencias en estética avanzada para brindarte una experiencia transformadora.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/reservar" style={{ backgroundColor: "#8B2434", color: "#FFFFFF", textDecoration: "none", padding: "1rem 2.5rem", borderRadius: "9999px", fontSize: "1rem", fontWeight: 700, boxShadow: "0 6px 20px rgba(139, 36, 52, 0.25)" }}>
            Reservar Atención →
          </Link>
          <a href="#servicios" style={{ backgroundColor: "#FFFFFF", color: "#1F1F1F", textDecoration: "none", padding: "1rem 2rem", borderRadius: "9999px", fontSize: "1rem", fontWeight: 600, border: "1px solid #E2E8F0" }}>
            Ver Tratamientos
          </a>
        </div>
      </section>

      {/* SERVICIOS / CATÁLOGO */}
      <section id="servicios" style={{ padding: "5rem 3rem", backgroundColor: "#FFFFFF", borderTop: "1px solid #F4EEE8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ color: "#7D8E7C", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Especialidades Clínicas</span>
            <h2 style={{ fontSize: "2.5rem", fontFamily: "serif", marginTop: "0.5rem" }}>Nuestros Tratamientos Destacados</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            {servicios.map((s, index) => (
              <div key={index} style={{ backgroundColor: "#FBF9F6", borderRadius: "24px", padding: "2.5rem 2rem", border: "1px solid #F4EEE8", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{s.icono}</div>
                  <span style={{ fontSize: "0.75rem", color: "#8B2434", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.tag}</span>
                  <h3 style={{ fontSize: "1.4rem", fontFamily: "serif", margin: "0.5rem 0 1rem 0" }}>{s.titulo}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.5, marginBottom: "1.5rem" }}>{s.descripcion}</p>
                </div>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#7D8E7C", marginBottom: "1rem" }}>{s.precio}</div>
                  <Link href="/reservar" style={{ display: "block", textAlign: "center", backgroundColor: "#FFFFFF", color: "#8B2434", border: "1px solid #8B2434", padding: "0.75rem", borderRadius: "9999px", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
                    Agendar Evaluación
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#1F1F1F", color: "#FFFFFF", padding: "4rem 3rem 2rem 3rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "3rem", marginBottom: "2rem" }}>
          <div>
            <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "serif", letterSpacing: "0.05em" }}>ANLUVIA</span>
            <p style={{ color: "#AAA", fontSize: "0.85rem", marginTop: "0.5rem" }}>Av. Las Condes #12345, Santiago, Chile • +56 9 1234 5678</p>
          </div>
          <div>
            <Link href="/reservar" style={{ backgroundColor: "#8B2434", color: "#FFF", padding: "0.85rem 2rem", borderRadius: "9999px", textDecoration: "none", fontWeight: 700 }}>
              Reserva tu Cita
            </Link>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#666" }}>
          © 2026 ANLUVIA Clinique & Wellness. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
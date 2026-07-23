import React from "react";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", margin: 0, padding: 0 }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
        
        .playfair { font-family: "Playfair Display", serif; }
        .inter { font-family: "Inter", sans-serif; }
        
        html { scroll-behavior: smooth; }
        
        .nav-link {
          color: #666666;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.3s ease;
          position: relative;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: #7D8E7C;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .btn-primary {
          background-color: #7D8E7C;
          color: #FFFFFF;
          padding: 0.85rem 2rem;
          border-radius: 9999px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(125, 142, 124, 0.25);
          text-decoration: none;
          display: inline-block;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover {
          background-color: #6a7b69;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(125, 142, 124, 0.35);
        }

        .btn-auth {
          color: #1F1F1F;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.6rem 1.25rem;
          border-radius: 9999px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .btn-auth:hover {
          background-color: #F4EEE8;
          border-color: #A7B7A5;
        }

        .hero-metric {
          border-left: 1px solid rgba(167, 183, 165, 0.3);
          padding-left: 1.5rem;
          text-align: left;
        }
      `}</style>

      {/* Header Master V2 */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: "rgba(251, 249, 246, 0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(125, 142, 124, 0.1)",
        padding: "1.25rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="playfair" style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "0.05em", color: "#1F1F1F" }}>
            ANLUVIA
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, borderLeft: "1px solid #A7B7A5", paddingLeft: "1rem" }}>
            CLINIQUE
          </span>
        </div>

        <nav style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
          <a href="#inicio" className="nav-link">Inicio</a>
          <a href="#servicios" className="nav-link">Servicios</a>
          <a href="#filosofia" className="nav-link">Filosofía</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="/login" className="btn-auth">Iniciar Sesión</a>
          <a href="/reservar" className="btn-primary">Reservar Hora</a>
        </div>
      </header>

      {/* Hero Master V2 */}
      <section id="inicio" style={{ paddingTop: "12rem", paddingBottom: "8rem", textAlign: "center", maxWidth: "1200px", margin: "0 auto", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <div style={{ backgroundColor: "#F4EEE8", color: "#7D8E7C", padding: "0.5rem 1.5rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", display: "inline-block", marginBottom: "2.5rem" }}>
          MASTER DESIGN V2 — EXPERIENCIA PREMIUM
        </div>

        <h1 className="playfair" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 600, lineHeight: 1.1, color: "#1F1F1F", marginBottom: "2rem" }}>
          Recupera tu bienestar.<br />
          <span style={{ fontStyle: "italic", color: "#7D8E7C", fontWeight: 400 }}>Realza tu belleza.</span>
        </h1>

        <p style={{ fontSize: "1.25rem", color: "#666", maxWidth: "700px", margin: "0 auto 4rem auto", lineHeight: 1.8, fontWeight: 300 }}>
          Descubre el equilibrio perfecto entre ciencia clínica y estética de lujo. 
          Un ecosistema digital diseñado para acompañarte en cada paso de tu transformación.
        </p>

        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "7rem" }}>
          <a href="/reservar" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1rem" }}>Comenzar Experiencia</a>
          <a href="/login" className="btn-auth" style={{ border: "1px solid #7D8E7C", padding: "1rem 2.5rem" }}>Acceder a mi Portal</a>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem", maxWidth: "1000px", margin: "0 auto" }}>
          <div className="hero-metric">
            <div className="playfair" style={{ fontSize: "3rem", color: "#7D8E7C", fontWeight: 600 }}>+5k</div>
            <div style={{ fontSize: "0.8rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.5rem" }}>Tratamientos</div>
          </div>
          <div className="hero-metric">
            <div className="playfair" style={{ fontSize: "3rem", color: "#8B2434", fontWeight: 600 }}>98%</div>
            <div style={{ fontSize: "0.8rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.5rem" }}>Satisfacción</div>
          </div>
          <div className="hero-metric">
            <div className="playfair" style={{ fontSize: "3rem", color: "#7D8E7C", fontWeight: 600 }}>100%</div>
            <div style={{ fontSize: "0.8rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.5rem" }}>Privacidad</div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer style={{ borderTop: "1px solid rgba(125, 142, 124, 0.1)", padding: "4rem 2rem", textAlign: "center", backgroundColor: "#FFFFFF" }}>
        <span className="playfair" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "0.05em" }}>ANLUVIA</span>
        <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "1rem" }}>© 2026 ANLUVIA CLINIQUE. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
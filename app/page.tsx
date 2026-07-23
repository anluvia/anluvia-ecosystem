import React from "react";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", margin: 0, padding: 0 }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
        
        .playfair { fontFamily: "Playfair Display", serif; }
        .inter { fontFamily: "Inter, sans-serif"; }
        
        html { scroll-behavior: smooth; }
        
        .nav-link {
          color: #666666;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #1F1F1F;
        }

        .btn-primary {
          background-color: #7D8E7C;
          color: #FFFFFF;
          padding: 0.85rem 1.8rem;
          border-radius: 9999px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(125, 142, 124, 0.25);
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover {
          background-color: #6a7b69;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background-color: transparent;
          color: #1F1F1F;
          padding: 0.85rem 1.8rem;
          border-radius: 9999px;
          font-weight: 500;
          border: 1px solid #7D8E7C;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .btn-secondary:hover {
          background-color: #F4EEE8;
          transform: translateY(-2px);
        }

        .btn-link-auth {
          color: #1F1F1F;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.6rem 1.2rem;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .btn-link-auth:hover {
          background-color: #F4EEE8;
        }

        .card-editorial {
          background-color: #FFFFFF;
          border: 1px solid rgba(167, 183, 165, 0.25);
          border-radius: 20px;
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px -10px rgba(31, 31, 31, 0.03);
        }
        .card-editorial:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -15px rgba(125, 142, 124, 0.15);
          border-color: #A7B7A5;
        }
      `}</style>

      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(251, 249, 246, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(244, 238, 232, 0.8)",
        padding: "1.25rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="playfair" style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "0.05em", color: "#1F1F1F" }}>
            ANLUVIA
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 600, borderLeft: "1px solid #A7B7A5", paddingLeft: "0.75rem" }}>
            Clinique
          </span>
        </div>

        <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <a href="#inicio" className="nav-link">Inicio</a>
          <a href="#servicios" className="nav-link">Servicios</a>
          <a href="#nosotros" className="nav-link">Nosotros</a>
          <a href="#contacto" className="nav-link">Contacto</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/login" className="btn-link-auth">
            Iniciar Sesión
          </a>
          <a href="/login" className="btn-primary" style={{ fontSize: "0.9rem" }}>
            Reservar Hora
          </a>
        </div>
      </header>

      <section id="inicio" style={{
        paddingTop: "11rem",
        paddingBottom: "7rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <div style={{
          display: "inline-block",
          backgroundColor: "#F4EEE8",
          color: "#8B2434",
          padding: "0.5rem 1.25rem",
          borderRadius: "9999px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
          marginBottom: "2rem"
        }}>
          TECNOLOGÍA, BIENESTAR Y BELLEZA EN PERFECTA ARMONÍA
        </div>

        <h1 className="playfair" style={{
          fontSize: "clamp(2.75rem, 5vw, 4.75rem)",
          fontWeight: 600,
          lineHeight: 1.15,
          color: "#1F1F1F",
          margin: "0 auto 1.75rem auto",
          maxWidth: "950px",
          letterSpacing: "-0.02em"
        }}>
          Recupera tu bienestar.<br />
          <span style={{ fontStyle: "italic", color: "#7D8E7C", fontWeight: 400 }}>Realza tu belleza.</span>
        </h1>

        <p style={{
          fontSize: "1.2rem",
          color: "#666666",
          maxWidth: "680px",
          margin: "0 auto 3rem auto",
          lineHeight: 1.7,
          fontWeight: 300
        }}>
          Una experiencia médica integral premium. Fusionamos kinesiología de alta precisión, estética avanzada y medicina preventiva en un entorno exclusivo diseñado para ti.
        </p>

        <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <a href="/login" className="btn-primary">
            Reservar Hora
          </a>
          <a href="/login" className="btn-secondary">
            Acceder a mi Portal
          </a>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          marginTop: "6rem",
          paddingTop: "3rem",
          borderTop: "1px solid rgba(167, 183, 165, 0.3)",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          <div>
            <div className="playfair" style={{ fontSize: "2.5rem", fontWeight: 700, color: "#7D8E7C" }}>+5.000</div>
            <div style={{ fontSize: "0.85rem", color: "#666666", marginTop: "0.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Tratamientos Exitosos</div>
          </div>
          <div>
            <div className="playfair" style={{ fontSize: "2.5rem", fontWeight 700, color: "#8B2434" }}>98%</div>
            <div style={{ fontSize: "0.85rem", color: "#666666", marginTop: "0.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Satisfacción Pacientes</div>
          </div>
          <div>
            <div className="playfair" style={{ fontSize: "2.5rem", fontWeight 700, color: "#7D8E7C" }}>+10 Años</div>
            <div style={{ fontSize: "0.85rem", color: "#666666", marginTop: "0.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Excelencia Clínica</div>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: "#1F1F1F", color: "#F4EEE8", padding: "4rem 2rem 2rem 2rem", textAlign: "center" }}>
        <span className="playfair" style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "0.05em", color: "#FBF9F6" }}>
          ANLUVIA
        </span>
        <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#666" }}>
          © 2026 ANLUVIA Clinique. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
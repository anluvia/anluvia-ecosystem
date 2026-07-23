import React from "react";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", margin: 0, padding: 0 }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
        
        .playfair { fontFamily: "Playfair Display", serif; }
        .inter { fontFamily: "Inter", sans-serif; }
        
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
          box-shadow: 0 6px 20px rgba(125, 142, 124, 0.35);
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

      {/* Header */}
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
          <a href="#equipo" className="nav-link">Equipo</a>
          <a href="#contacto" className="nav-link">Contacto</a>
        </nav>

        <div>
          <a href="#reservar" className="btn-primary" style={{ fontSize: "0.9rem" }}>
            Reservar Hora
          </a>
        </div>
      </header>

      {/* Hero Section */}
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
          <a href="#reservar" className="btn-primary">
            Reservar Hora
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Hablar por WhatsApp
          </a>
        </div>

        {/* Indicators */}
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
            <div className="playfair" style={{ fontSize: "2.5rem", fontWeight: 700, color: "#8B2434" }}>98%</div>
            <div style={{ fontSize: "0.85rem", color: "#666666", marginTop: "0.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Satisfacción Pacientes</div>
          </div>
          <div>
            <div className="playfair" style={{ fontSize: "2.5rem", fontWeight: 700, color: "#7D8E7C" }}>+10 Años</div>
            <div style={{ fontSize: "0.85rem", color: "#666666", marginTop: "0.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Excelencia Clínica</div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" style={{ backgroundColor: "#F4EEE8", padding: "7rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <span style={{ color: "#8B2434", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              ESPECIALIDADES EXCLUSIVAS
            </span>
            <h2 className="playfair" style={{ fontSize: "2.75rem", marginTop: "0.75rem", color: "#1F1F1F" }}>
              Nuestras Áreas de Cuidado
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            {/* Card 1 */}
            <div className="card-editorial">
              <div style={{ color: "#7D8E7C", fontSize: "1.75rem", marginBottom: "1.25rem", fontWeight: 300 }}>01</div>
              <h3 className="playfair" style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#1F1F1F" }}>Kinesiología y Recuperación</h3>
              <p style={{ color: "#666666", lineHeight: 1.6, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                Rehabilitación funcional personalizada, terapia de onda de choque y evaluación biomecánica avanzada para deportistas y pacientes de alta exigencia.
              </p>
              <div style={{ borderTop: "1px solid #F4EEE8", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#8B2434", fontWeight: 500 }}>
                <span>Sesión: 60 min</span>
                <span>Atención Personalizada</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-editorial">
              <div style={{ color: "#8B2434", fontSize: "1.75rem", marginBottom: "1.25rem", fontWeight: 300 }}>02</div>
              <h3 className="playfair" style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#1F1F1F" }}>Estética Facial y Corporal</h3>
              <p style={{ color: "#666666", lineHeight: 1.6, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                Tratamientos dermato-funcionales de última generación, remodelación corporal no invasiva y rejuvenecimiento facial armónico.
              </p>
              <div style={{ borderTop: "1px solid #F4EEE8", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#8B2434", fontWeight: 500 }}>
                <span>Protocolo Médicamente Guiado</span>
                <span>Resultados Naturales</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-editorial">
              <div style={{ color: "#7D8E7C", fontSize: "1.75rem", marginBottom: "1.25rem", fontWeight: 300 }}>03</div>
              <h3 className="playfair" style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#1F1F1F" }}>Bienestar Integral y Spa</h3>
              <p style={{ color: "#666666", lineHeight: 1.6, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                Terapia de descompresión corporal, masoterapia de autor, drenaje linfático profundo y nutrición integral para el equilibrio del organismo.
              </p>
              <div style={{ borderTop: "1px solid #F4EEE8", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#8B2434", fontWeight: 500 }}>
                <span>Experiencia Sensorial</span>
                <span>Relajación Absoluta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofia / Por que ANLUVIA */}
      <section id="nosotros" style={{ padding: "8rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <span style={{ color: "#7D8E7C", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              FILOSOFÍA ANLUVIA
            </span>
            <h2 className="playfair" style={{ fontSize: "2.8rem", marginTop: "0.75rem", lineHeight: 1.2, color: "#1F1F1F" }}>
              Lujo silencioso, ciencia clínica y calidez humana.
            </h2>
            <p style={{ color: "#666666", marginTop: "1.5rem", lineHeight: 1.7, fontSize: "1.05rem" }}>
              En ANLUVIA no creemos en los tratamientos estandarizados. Combinamos tecnología médica de vanguardia con un diseño de experiencia enfocado en tu paz mental y corporal.
            </p>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", padding: "3rem", borderRadius: "24px", border: "1px solid #A7B7A5", boxShadow: "0 20px 40px -15px rgba(125, 142, 124, 0.12)" }}>
            <div style={{ borderBottom: "1px solid #F4EEE8", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
              <h4 className="playfair" style={{ fontSize: "1.25rem", color: "#8B2434", marginBottom: "0.35rem" }}>Equipamiento Médico Aprobado</h4>
              <p style={{ fontSize: "0.9rem", color: "#666666", margin: 0 }}>Tecnología de estándar europeo y certificación clínica internacional.</p>
            </div>
            <div style={{ borderBottom: "1px solid #F4EEE8", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
              <h4 className="playfair" style={{ fontSize: "1.25rem", color: "#7D8E7C", marginBottom: "0.35rem" }}>Diagnóstico Digital Unificado</h4>
              <p style={{ fontSize: "0.9rem", color: "#666666", margin: 0 }}>Seguimiento en tiempo real de tu evolución a través de tu portal privado de paciente.</p>
            </div>
            <div>
              <h4 className="playfair" style={{ fontSize: "1.25rem", color: "#1F1F1F", marginBottom: "0.35rem" }}>Espacios de Privacidad Privilegiada</h4>
              <p style={{ fontSize: "0.9rem", color: "#666666", margin: 0 }}>Diseño acústico e iluminación pensados para una experiencia de serenidad total.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1F1F1F", color: "#F4EEE8", padding: "5rem 2rem 3rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
          <div>
            <span className="playfair" style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "0.05em", color: "#FBF9F6" }}>
              ANLUVIA
            </span>
            <p style={{ color: "#A7B7A5", fontSize: "0.9rem", marginTop: "1rem", lineHeight: 1.6 }}>
              Salud, Estética y Recuperación Integral bajo los estándares más exigentes de la medicina moderna.
            </p>
          </div>
          <div>
            <h5 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#A7B7A5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Servicios</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "#999" }}>
              <span>Kinesiología Deportiva</span>
              <span>Rehabilitación Física</span>
              <span>Estética Facial Premium</span>
              <span>Modelado Corporal</span>
            </div>
          </div>
          <div>
            <h5 style={{ fontSize: "0.95rem", fontWeight: "600", color: "#A7B7A5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Contacto</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "#999" }}>
              <span>contacto@anluvia.com</span>
              <span>+56 9 1234 5678</span>
              <span>Santiago, Chile</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #333", paddingTop: "2rem", textAlign: "center", fontSize: "0.85rem", color: "#666" }}>
          © 2026 ANLUVIA Clinique. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
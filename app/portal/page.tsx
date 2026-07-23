import React from "react";

export default function PortalPaciente() {
  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
        .playfair { fontFamily: "Playfair Display", serif; }
        
        .card-dash {
          background-color: #FFFFFF;
          border: 1px solid rgba(167, 183, 165, 0.3);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px -10px rgba(31, 31, 31, 0.03);
          transition: all 0.3s ease;
        }
        .card-dash:hover {
          border-color: #7D8E7C;
          box-shadow: 0 15px 35px -10px rgba(125, 142, 124, 0.15);
        }

        .btn-salvia {
          background-color: #7D8E7C;
          color: #FFFFFF;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }
        .btn-salvia:hover {
          background-color: #6a7b69;
        }

        .tag-status {
          background-color: #F4EEE8;
          color: #8B2434;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      `}</style>

      {/* Top Header */}
      <header style={{
        backgroundColor: "rgba(251, 249, 246, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #F4EEE8",
        padding: "1.25rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="/" style={{ textDecoration: "none", color: "#1F1F1F" }} className="playfair">
            <span style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "0.05em" }}>ANLUVIA</span>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 600, marginLeft: "0.75rem" }}>
              PORTAL PACIENTE
            </span>
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Valentina Silva</div>
            <div style={{ fontSize: "0.8rem", color: "#666666" }}>Paciente Exclusivo #8492</div>
          </div>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "#7D8E7C",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "1rem"
          }}>
            VS
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}>
        
        {/* Welcome Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <span className="tag-status">BIENVENIDA DE VUELTA</span>
            <h1 className="playfair" style={{ fontSize: "2.75rem", marginTop: "0.75rem", color: "#1F1F1F", fontWeight: 600 }}>
              Hola, Valentina
            </h1>
            <p style={{ color: "#666666", marginTop: "0.5rem", fontSize: "1.05rem" }}>
              Tu plan de recuperación funcional marcha al 85%. Tienes una cita agendada para mañana.
            </p>
          </div>
          <div>
            <a href="/" className="btn-salvia">
              + Agendar Nueva Cita
            </a>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem", marginBottom: "3rem" }}>
          
          <div className="card-dash">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#7D8E7C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Próxima Cita</span>
              <span style={{ fontSize: "1.2rem" }}>📅</span>
            </div>
            <div className="playfair" style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1F1F1F", marginBottom: "0.35rem" }}>
              Mañana, 15:30 hrs
            </div>
            <div style={{ color: "#666666", fontSize: "0.9rem" }}>
              Kinesiología Deportiva — Box 3
            </div>
            <div style={{ marginTop: "1.25rem", borderTop: "1px solid #F4EEE8", paddingTop: "0.75rem", fontSize: "0.85rem", color: "#8B2434", fontWeight: "500" }}>
              Dr. Matías Arancibia
            </div>
          </div>

          <div className="card-dash">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#7D8E7C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Tratamiento Activo</span>
              <span style={{ fontSize: "1.2rem" }}>🩺</span>
            </div>
            <div className="playfair" style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1F1F1F", marginBottom: "0.35rem" }}>
              Sesión 5 de 8
            </div>
            <div style={{ color: "#666666", fontSize: "0.9rem" }}>
              Rehabilitación Lumbar & Postura
            </div>
            <div style={{ marginTop: "1rem", backgroundColor: "#F4EEE8", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#7D8E7C", width: "62.5%", height: "100%" }}></div>
            </div>
          </div>

          <div className="card-dash">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#8B2434", letterSpacing: "0.1em", textTransform: "uppercase" }}>Evolución Estética</span>
              <span style={{ fontSize: "1.2rem" }}>✨</span>
            </div>
            <div className="playfair" style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1F1F1F", marginBottom: "0.35rem" }}>
              Facial Armónico
            </div>
            <div style={{ color: "#666666", fontSize: "0.9rem" }}>
              Último control: hace 12 días
            </div>
            <div style={{ marginTop: "1.25rem", borderTop: "1px solid #F4EEE8", paddingTop: "0.75rem", fontSize: "0.85rem", color: "#7D8E7C", fontWeight: "500" }}>
              Ver Evolución →
            </div>
          </div>

        </div>

        {/* Detailed Modules Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2.5rem" }}>
          
          {/* Module 1: Pauta de Ejercicios */}
          <div className="card-dash">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 className="playfair" style={{ fontSize: "1.4rem", color: "#1F1F1F" }}>
                Pauta de Ejercicios en Casa
              </h3>
              <span style={{ fontSize: "0.85rem", color: "#7D8E7C", fontWeight: "600" }}>3 ejercicios hoy</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "#FBF9F6", borderRadius: "12px", border: "1px solid #F4EEE8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>1. Movilidad Torácica con Foam Roller</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>3 series x 12 repeticiones • 5 min</div>
                </div>
                <span style={{ color: "#7D8E7C", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>▶ Ver Video</span>
              </div>

              <div style={{ padding: "1rem", backgroundColor: "#FBF9F6", borderRadius: "12px", border: "1px solid #F4EEE8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>2. Fortalecimiento de Core Profundo</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>4 series x 45 segundos • 8 min</div>
                </div>
                <span style={{ color: "#7D8E7C", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>▶ Ver Video</span>
              </div>
            </div>
          </div>

          {/* Module 2: Indicaciones & Recetas */}
          <div className="card-dash">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 className="playfair" style={{ fontSize: "1.4rem", color: "#1F1F1F" }}>
                Indicaciones & Recetas
              </h3>
              <span style={{ fontSize: "0.85rem", color: "#8B2434", fontWeight: "600" }}>Documentos</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "#FBF9F6", borderRadius: "12px", border: "1px solid #F4EEE8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Protocolo Post-Tratamiento Estético</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>Emitido: 10 de Julio, 2026</div>
                </div>
                <span style={{ color: "#8B2434", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>📥 PDF</span>
              </div>

              <div style={{ padding: "1rem", backgroundColor: "#FBF9F6", borderRadius: "12px", border: "1px solid #F4EEE8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Orden de Evaluación Biomecánica</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>Emitido: 02 de Julio, 2026</div>
                </div>
                <span style={{ color: "#8B2434", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>📥 PDF</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
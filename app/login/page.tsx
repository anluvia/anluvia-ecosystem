import React, { useState } from "react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
        .playfair { fontFamily: "Playfair Display", serif; }

        .input-anluvia {
          width: 100%;
          padding: 0.9rem 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(167, 183, 165, 0.4);
          background-color: #FFFFFF;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .input-anluvia:focus {
          border-color: #7D8E7C;
          box-shadow: 0 0 0 3px rgba(125, 142, 124, 0.15);
        }

        .btn-salvia {
          width: 100%;
          background-color: #7D8E7C;
          color: #FFFFFF;
          padding: 1rem;
          border-radius: 9999px;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          text-decoration: none;
          display: block;
          box-shadow: 0 4px 14px rgba(125, 142, 124, 0.25);
        }
        .btn-salvia:hover {
          background-color: #6a7b69;
          transform: translateY(-2px);
        }

        .tab-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          background: transparent;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #666;
          border-bottom: 2px solid transparent;
        }
        .tab-active {
          color: #1F1F1F;
          border-bottom: 2px solid #7D8E7C;
        }
      `}</style>

      {/* Header Fijo */}
      <header style={{ padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none", color: "#1F1F1F" }} className="playfair">
          <span style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>ANLUVIA</span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 600, marginLeft: "0.75rem" }}>
            Clinique
          </span>
        </a>
        <a href="/" style={{ textDecoration: "none", color: "#666666", fontSize: "0.9rem", fontWeight: 500 }}>
          ← Volver al Inicio
        </a>
      </header>

      {/* Form Container */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(167, 183, 165, 0.3)",
          borderRadius: "24px",
          padding: "3rem",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 20px 50px -15px rgba(31, 31, 31, 0.05)"
        }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #F4EEE8", marginBottom: "2.5rem" }}>
            <button
              className={`tab-btn ${!isSignUp ? "tab-active" : ""}`}
              onClick={() => setIsSignUp(false)}
            >
              Iniciar Sesión
            </button>
            <button
              className={`tab-btn ${isSignUp ? "tab-active" : ""}`}
              onClick={() => setIsSignUp(true)}
            >
              Crear Cuenta
            </button>
          </div>

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 className="playfair" style={{ fontSize: "2rem", color: "#1F1F1F", margin: 0 }}>
              {isSignUp ? "Únete a ANLUVIA" : "Bienvenido de Nuevo"}
            </h1>
            <p style={{ color: "#666666", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              {isSignUp
                ? "Crea tu perfil exclusivo para gestionar tus citas y tratamientos."
                : "Ingresa tus credenciales para acceder a tu portal de salud."}
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {isSignUp && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
                  Nombre Completo
                </label>
                <input type="text" placeholder="Valentina Silva" className="input-anluvia" />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
                Correo Electrónico
              </label>
              <input type="email" placeholder="paciente@anluvia.com" className="input-anluvia" />
            </div>

            {isSignUp && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
                  Teléfono de Contacto
                </label>
                <input type="tel" placeholder="+56 9 1234 5678" className="input-anluvia" />
              </div>
            )}

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#666" }}>
                  Contraseña
                </label>
                {!isSignUp && (
                  <a href="#" style={{ fontSize: "0.8rem", color: "#8B2434", textDecoration: "none", fontWeight: 500 }}>
                    ¿Olvidaste tu contraseña?
                  </a>
                )}
              </div>
              <input type="password" placeholder="••••••••" className="input-anluvia" />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <a href="/portal" className="btn-salvia">
                {isSignUp ? "Registrarme e Ingresar" : "Ingresar a mi Portal"}
              </a>
            </div>

          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", borderTop: "1px solid #F4EEE8", paddingTop: "1.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              {isSignUp ? "¿Ya tienes una cuenta? " : "¿Aún no eres paciente de ANLUVIA? "}
            </span>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: "none", border: "none", color: "#8B2434", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
            >
              {isSignUp ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          </div>

        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "1.5rem", fontSize: "0.8rem", color: "#999" }}>
        © 2026 ANLUVIA Clinique. Todos los datos están encriptados con estándar de seguridad médica.
      </footer>
    </div>
  );
}
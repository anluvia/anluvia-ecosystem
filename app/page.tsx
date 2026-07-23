export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem", borderBottom: "1px solid #1e293b" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", background: "linear-gradient(to right, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ANLUVIA
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#caracteristicas" style={{ color: "#94a3b8", textDecoration: "none" }}>Soluciones</a>
          <a href="#modulos" style={{ color: "#94a3b8", textDecoration: "none" }}>Ecosistema</a>
          <button style={{ backgroundColor: "#38bdf8", color: "#0f172a", padding: "0.6rem 1.2rem", borderRadius: "0.5rem", fontWeight: "600", border: "none", cursor: "pointer" }}>
            Acceder a Clínica
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: "center", padding: "5rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <span style={{ backgroundColor: "#1e293b", color: "#38bdf8", padding: "0.4rem 1rem", borderRadius: "2rem", fontSize: "0.875rem", fontWeight: "500", border: "1px solid #334155" }}>
          🚀 Plataforma Multi-Tenant para la Salud
        </span>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginTop: "1.5rem", lineHeight: "1.2", letterSpacing: "-0.02em" }}>
          El Ecosistema Digital Completo para tu Centro Médico
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#94a3b8", marginTop: "1.5rem", lineHeight: "1.6" }}>
          Gestiona fichas clínicas, agendas, facturación y sincronización en tiempo real para múltiples sedes y profesionales desde una sola plataforma.
        </p>
        <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button style={{ backgroundColor: "#0284c7", color: "#fff", padding: "0.8rem 1.8rem", borderRadius: "0.5rem", fontWeight: "600", fontSize: "1rem", border: "none", cursor: "pointer" }}>
            Comenzar Ahora
          </button>
          <button style={{ backgroundColor: "transparent", color: "#f8fafc", padding: "0.8rem 1.8rem", borderRadius: "0.5rem", fontWeight: "600", fontSize: "1rem", border: "1px solid #334155", cursor: "pointer" }}>
            Agendar Demo
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="caracteristicas" style={{ padding: "4rem 2rem", maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div style={{ backgroundColor: "#1e293b", padding: "2rem", borderRadius: "0.75rem", border: "1px solid #334155" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🩺</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Ficha Clínica Inteligente</h3>
          <p style={{ color: "#94a3b8", lineHeight: "1.5" }}>Historial médico unificado, recetas digitales e integración rápida con Prisma y Supabase.</p>
        </div>

        <div style={{ backgroundColor: "#1e293b", padding: "2rem", borderRadius: "0.75rem", border: "1px solid #334155" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📅</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Agenda y Citas</h3>
          <p style={{ color: "#94a3b8", lineHeight: "1.5" }}>Gestión multi-profesional con recordatorios automáticos y control de disponibilidad.</p>
        </div>

        <div style={{ backgroundColor: "#1e293b", padding: "2rem", borderRadius: "0.75rem", border: "1px solid #334155" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏢</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Arquitectura Multi-tenant</h3>
          <p style={{ color: "#94a3b8", lineHeight: "1.5" }}>Subdominios personalizados para cada clínica con aislamiento total de datos.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid #1e293b", color: "#64748b", marginTop: "4rem" }}>
        <p>© 2026 ANLUVIA Ecosystem. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
'use client';

import React, { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("agenda");

  const adminCss = `
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
    .playfair { font-family: "Playfair Display", serif; }

    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      color: #666;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .sidebar-item:hover, .sidebar-active {
      background-color: #F4EEE8;
      color: #1F1F1F;
      font-weight: 600;
    }

    .card-stat {
      background-color: #FFFFFF;
      border: 1px solid rgba(167, 183, 165, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px -5px rgba(31, 31, 31, 0.03);
    }

    .table-admin {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    .table-admin th {
      text-align: left;
      padding: 1rem;
      background-color: #F4EEE8;
      color: #1F1F1F;
      font-weight: 600;
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .table-admin td {
      padding: 1rem;
      border-bottom: 1px solid #F4EEE8;
      color: #4A4A4A;
    }

    .btn-salvia {
      background-color: #7D8E7C;
      color: #FFFFFF;
      padding: 0.65rem 1.25rem;
      border-radius: 9999px;
      border: none;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-salvia:hover {
      background-color: #6a7b69;
    }

    .badge-status {
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
  `;

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", display: "flex" }}>
      <style dangerouslySetInnerHTML={{ __html: adminCss }} />

      {/* Sidebar Lateral */}
      <aside style={{ width: "260px", borderRight: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "2.5rem" }} className="playfair">
            <span style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "0.05em" }}>ANLUVIA</span>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem" }}>
              PANEL EJECUTIVO
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div className={`sidebar-item ${activeTab === 'agenda' ? 'sidebar-active' : ''}`} onClick={() => setActiveTab('agenda')}>
              📅 Agenda & Citas
            </div>
            <div className={`sidebar-item ${activeTab === 'pacientes' ? 'sidebar-active' : ''}`} onClick={() => setActiveTab('pacientes')}>
              🩺 Fichas Clínicas
            </div>
            <div className={`sidebar-item ${activeTab === 'finanzas' ? 'sidebar-active' : ''}`} onClick={() => setActiveTab('finanzas')}>
              📊 Métricas & Ingresos
            </div>
            <div className={`sidebar-item ${activeTab === 'equipo' ? 'sidebar-active' : ''}`} onClick={() => setActiveTab('equipo')}>
              👩‍⚕️ Especialistas
            </div>
          </nav>
        </div>

        <div style={{ borderTop: "1px solid #F4EEE8", paddingTop: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Dr. Matías Arancibia</div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>Director Médico — Sede Las Condes</div>
          <a href="/" style={{ fontSize: "0.8rem", color: "#8B2434", display: "inline-block", marginTop: "0.75rem", textDecoration: "none", fontWeight: 600 }}>
            ← Salir al Sitio
          </a>
        </div>
      </aside>

      {/* Area Principal */}
      <main style={{ flex: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7D8E7C", letterSpacing: "0.1em", textTransform: "uppercase" }}>SEDE PRINCIPAL</span>
            <h1 className="playfair" style={{ fontSize: "2.25rem", color: "#1F1F1F", margin: "0.25rem 0 0 0" }}>Control de Operaciones</h1>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn-salvia">+ Nueva Cita Presencial</button>
            <button style={{ backgroundColor: "#F4EEE8", color: "#1F1F1F", padding: "0.65rem 1.25rem", borderRadius: "9999px", border: "1px solid #A7B7A5", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
              📥 Exportar Reporte
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Citas de Hoy</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.25rem" }}>18 Pacientes</div>
            <span style={{ fontSize: "0.8rem", color: "#7D8E7C", fontWeight: 600 }}>94% Ocupación</span>
          </div>

          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ingresos del Mes</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.25rem" }}>$14.280.000</div>
            <span style={{ fontSize: "0.8rem", color: "#7D8E7C", fontWeight: 600 }}>+12% vs mes anterior</span>
          </div>

          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pacientes Nuevos</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#8B2434", marginTop: "0.25rem" }}>42 Registros</div>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>Últimos 30 días</span>
          </div>

          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Evaluación Promedio</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.25rem" }}>4.95 / 5.0</div>
            <span style={{ fontSize: "0.8rem", color: "#7D8E7C", fontWeight: 600 }}>★ ★ ★ ★ ★</span>
          </div>
        </div>

        {/* Tabla Citas */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid rgba(167, 183, 165, 0.3)", padding: "2rem", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 className="playfair" style={{ fontSize: "1.4rem", margin: 0 }}>Agenda del Día</h3>
            <span style={{ fontSize: "0.85rem", color: "#7D8E7C", fontWeight: 600 }}>Sede Las Condes</span>
          </div>

          <table className="table-admin">
            <thead>
              <tr>
                <th>Horario</th>
                <th>Paciente</th>
                <th>Tratamiento</th>
                <th>Especialista</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>09:00 - 10:00</td>
                <td>Valentina Silva</td>
                <td>Kinesiología Deportiva</td>
                <td>Dr. Matías Arancibia</td>
                <td><span className="badge-status" style={{ backgroundColor: "#E6F4EA", color: "#137333" }}>Confirmada</span></td>
                <td><button style={{ border: "none", background: "none", color: "#7D8E7C", cursor: "pointer", fontWeight: 600 }}>Ver Ficha →</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>10:30 - 11:15</td>
                <td>Camila Ugarte</td>
                <td>Estética Facial Armónica</td>
                <td>Dra. Camila Morales</td>
                <td><span className="badge-status" style={{ backgroundColor: "#E6F4EA", color: "#137333" }}>En Atención</span></td>
                <td><button style={{ border: "none", background: "none", color: "#7D8E7C", cursor: "pointer", fontWeight: 600 }}>Ver Ficha →</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>12:00 - 13:00</td>
                <td>Rodrigo Mendoza</td>
                <td>Rehabilitación Lumbar</td>
                <td>Dr. Matías Arancibia</td>
                <td><span className="badge-status" style={{ backgroundColor: "#FEF7E0", color: "#B06000" }}>Pendiente</span></td>
                <td><button style={{ border: "none", background: "none", color: "#7D8E7C", cursor: "pointer", fontWeight: 600 }}>Ver Ficha →</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
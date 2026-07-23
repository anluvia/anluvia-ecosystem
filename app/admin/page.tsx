'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("agenda");
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

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
      display: inline-block;
    }

    .select-status {
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #A7B7A5;
      background-color: #FFF;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }
  `;

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReservas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizandoId(id);
    try {
      const { error } = await supabase
        .from('reservas')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (!error) {
        setReservas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
        );
      } else {
        alert("⚠️ No se pudo actualizar el estado.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActualizandoId(null);
    }
  };

  const totalCitas = reservas.length;
  const confirmadas = reservas.filter((r) => (r.estado || 'Confirmada') === 'Confirmada').length;
  const enAtencion = reservas.filter((r) => r.estado === 'En Atención').length;
  const completadas = reservas.filter((r) => r.estado === 'Completada').length;

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
              🩺 Pacientes ({totalCitas})
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

      {/* Área Principal */}
      <main style={{ flex: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>
        
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7D8E7C", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              BASE DE DATOS EN VIVO — SUPABASE
            </span>
            <h1 className="playfair" style={{ fontSize: "2.25rem", color: "#1F1F1F", margin: "0.25rem 0 0 0" }}>
              Control de Operaciones
            </h1>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={cargarReservas} className="btn-salvia">
              🔄 Actualizar Citas
            </button>
            <a href="/reservar" target="_blank" style={{ backgroundColor: "#F4EEE8", color: "#1F1F1F", padding: "0.65rem 1.25rem", borderRadius: "9999px", border: "1px solid #A7B7A5", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
              + Probador de Citas ↗
            </a>
          </div>
        </div>

        {/* Stats Grid Reales */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Reservas</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.25rem" }}>
              {totalCitas} Citas
            </div>
            <span style={{ fontSize: "0.8rem", color: "#7D8E7C", fontWeight: 600 }}>Registradas en sistema</span>
          </div>

          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Confirmadas</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#7D8E7C", marginTop: "0.25rem" }}>
              {confirmadas} Pacientes
            </div>
            <span style={{ fontSize: "0.8rem", color: "#7D8E7C", fontWeight: 600 }}>Listos para atención</span>
          </div>

          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>En Atención</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#8B2434", marginTop: "0.25rem" }}>
              {enAtencion} Pacientes
            </div>
            <span style={{ fontSize: "0.8rem", color: "#8B2434", fontWeight: 600 }}>En consulta actual</span>
          </div>

          <div className="card-stat">
            <span style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Completadas</span>
            <div className="playfair" style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.25rem" }}>
              {completadas} Atenciones
            </div>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>Finalizadas con éxito</span>
          </div>
        </div>

        {/* Tabla de Citas Reales */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid rgba(167, 183, 165, 0.3)", padding: "2rem", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 className="playfair" style={{ fontSize: "1.4rem", margin: 0 }}>Gestión de Reservas en Vivo</h3>
            <span style={{ fontSize: "0.85rem", color: "#7D8E7C", fontWeight: 600 }}>Sede Las Condes</span>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Cargando datos desde Supabase...</div>
          ) : reservas.length > 0 ? (
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Fecha & Hora</th>
                  <th>Paciente</th>
                  <th>Tratamiento</th>
                  <th>Especialista</th>
                  <th>Estado Actual</th>
                  <th>Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>
                      <div>{r.fecha}</div>
                      <div style={{ fontSize: "0.8rem", color: "#8B2434" }}>{r.hora} hrs</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#1F1F1F" }}>{r.paciente_nombre || 'Paciente'}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>{r.paciente_email}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.servicio}</td>
                    <td>{r.especialista}</td>
                    <td>
                      <span className="badge-status" style={{
                        backgroundColor: r.estado === 'En Atención' ? '#FEF7E0' : r.estado === 'Completada' ? '#E6F4EA' : r.estado === 'Cancelada' ? '#FCE8E6' : '#E6F4EA',
                        color: r.estado === 'En Atención' ? '#B06000' : r.estado === 'Completada' ? '#137333' : r.estado === 'Cancelada' ? '#C5221F' : '#137333'
                      }}>
                        {r.estado || 'Confirmada'}
                      </span>
                    </td>
                    <td>
                      <select
                        disabled={actualizandoId === r.id}
                        value={r.estado || 'Confirmada'}
                        onChange={(e) => cambiarEstado(r.id, e.target.value)}
                        className="select-status"
                      >
                        <option value="Confirmada">Confirmada</option>
                        <option value="En Atención">En Atención</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
              No se han registrado citas aún en la base de datos.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
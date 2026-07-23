'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); // Tab por defecto: Dashboard
  const [reservas, setReservas] = useState<any[]>([]);
  const [evoluciones, setEvoluciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulario de Evolucion Kinesica
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState('');
  const [selectedPacienteNombre, setSelectedPacienteNombre] = useState('');
  const [especialista, setEspecialista] = useState('Dr. Matías Arancibia');
  const [numSesion, setNumSesion] = useState(1);
  const [evaDolor, setEvaDolor] = useState(5);
  const [subjetivo, setSubjetivo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [guardandoEvolucion, setGuardandoEvolucion] = useState(false);
  const [mensajeFicha, setMensajeFicha] = useState('');

  // Tabla de Precios Estimados por Tratamiento para calculo de ingresos
  const preciosServicios: { [key: string]: number } = {
    'Kinesiología & Recuperación Física': 45000,
    'Estética Facial Premium & Armonización': 55000,
    'Remodelación Corporal & Drenaje': 50000,
    'Masoterapia & Bienestar Integral': 40000,
  };

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

    .kpi-card {
      background-color: #FFFFFF;
      border-radius: 20px;
      padding: 1.5rem 1.75rem;
      border: 1px solid rgba(167, 183, 165, 0.3);
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
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
    .btn-salvia:hover { background-color: #6a7b69; }

    .btn-pdf {
      background-color: #8B2434;
      color: #FFFFFF;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      border: none;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(139, 36, 52, 0.25);
    }
    .btn-pdf:hover { background-color: #721c29; }
    .btn-pdf:disabled { opacity: 0.5; cursor: not-allowed; }

    .input-anluvia {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      background-color: #FFF;
    }
    .textarea-anluvia {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      min-height: 80px;
      font-family: inherit;
    }

    @media print {
      body * { visibility: hidden; }
      #area-pdf-oficial, #area-pdf-oficial * { visibility: visible; }
      #area-pdf-oficial {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
        background-color: #FFF !important;
        color: #000 !important;
      }
      .no-print { display: none !important; }
    }
  `;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { data: resData } = await supabase.from('reservas').select('*').order('created_at', { ascending: false });
      if (resData) setReservas(resData);

      const { data: evoData } = await supabase.from('evoluciones').select('*').order('created_at', { ascending: false });
      if (evoData) setEvoluciones(evoData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarParaFicha = (pacienteEmail: string, pacienteNombre: string) => {
    setSelectedPacienteEmail(pacienteEmail);
    setSelectedPacienteNombre(pacienteNombre);
    setActiveTab('fichas');

    const evolucionesPaciente = evoluciones.filter(e => e.paciente_email === pacienteEmail);
    setNumSesion(evolucionesPaciente.length + 1);
  };

  const guardarEvolucion = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoEvolucion(true);
    setMensajeFicha('');

    try {
      const { error } = await supabase.from('evoluciones').insert([
        {
          paciente_email: selectedPacienteEmail,
          paciente_nombre: selectedPacienteNombre,
          especialista,
          numero_sesion: numSesion,
          eva_dolor: evaDolor,
          subjetivo,
          objetivo,
          tratamiento,
          indicaciones
        }
      ]);

      if (error) {
        setMensajeFicha('⚠️ ' + error.message);
      } else {
        setMensajeFicha('🎉 ¡Evolución registrada en la Ficha Médica!');
        setSubjetivo('');
        setObjetivo('');
        setTratamiento('');
        setIndicaciones('');
        cargarDatos();
      }
    } catch (err: any) {
      console.error(err);
      setMensajeFicha('⚠️ Error al guardar.');
    } finally {
      setGuardandoEvolucion(false);
    }
  };

  const exportarPDF = () => {
    if (!selectedPacienteEmail) {
      alert("Por favor selecciona un paciente primero.");
      return;
    }
    window.print();
  };

  // CÁLCULOS ESTADÍSTICOS Y FINANCIEROS
  const totalCitas = reservas.length;
  const pacientesUnicos = Array.from(new Set(reservas.map(r => r.paciente_email))).map(email => {
    const reserva = reservas.find(r => r.paciente_email === email);
    return { email, nombre: reserva?.paciente_nombre || 'Paciente ANLUVIA' };
  });
  const totalPacientes = pacientesUnicos.length;

  const ingresosTotales = reservas.reduce((acc, r) => {
    const precio = preciosServicios[r.servicio] || 45000;
    return acc + precio;
  }, 0);

  const ticketPromedio = totalCitas > 0 ? Math.round(ingresosTotales / totalCitas) : 0;

  // Desglose por Servicio
  const serviciosConteo: { [key: string]: number } = {};
  reservas.forEach(r => {
    serviciosConteo[r.servicio] = (serviciosConteo[r.servicio] || 0) + 1;
  });

  const evolucionesPacienteActual = evoluciones.filter(e => e.paciente_email === selectedPacienteEmail);

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", display: "flex" }}>
      <style dangerouslySetInnerHTML={{ __html: adminCss }} />

      {/* Sidebar Lateral */}
      <aside className="no-print" style={{ width: "260px", borderRight: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "2.5rem" }} className="playfair">
            <span style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "0.05em" }}>ANLUVIA</span>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem" }}>
              PANEL EJECUTIVO
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div className={`sidebar-item ${activeTab === 'dashboard' ? 'sidebar-active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              📊 Dashboard & Métricas
            </div>
            <div className={`sidebar-item ${activeTab === 'agenda' ? 'sidebar-active' : ''}`} onClick={() => setActiveTab('agenda')}>
              📅 Agenda & Citas ({reservas.length})
            </div>
            <div className={`sidebar-item ${activeTab === 'fichas' ? 'sidebar-active' : ''}`} onClick={() => setActiveTab('fichas')}>
              🩺 Fichas & Evolución Kinésica
            </div>
          </nav>
        </div>

        <div style={{ borderTop: "1px solid #F4EEE8", paddingTop: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{especialista}</div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>Kinesiología & Estética</div>
          <a href="/" style={{ fontSize: "0.8rem", color: "#8B2434", display: "inline-block", marginTop: "0.75rem", textDecoration: "none", fontWeight: 600 }}>
            ← Salir al Sitio
          </a>
        </div>
      </aside>

      {/* Área Principal */}
      <main style={{ flex: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>

        {/* PESTAÑA 1: DASHBOARD & MÉTRICAS */}
        {activeTab === 'dashboard' && (
          <div className="no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B2434", letterSpacing: "0.1em" }}>RESUMEN GENERAL</span>
                <h1 className="playfair" style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0" }}>Indicadores de Negocio</h1>
              </div>
              <button onClick={cargarDatos} className="btn-salvia">🔄 Actualizar Datos</button>
            </div>

            {/* Tarjetas KPI */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div className="kpi-card">
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ingresos Estimados</span>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.3rem" }}>
                  ${ingresosTotales.toLocaleString('es-CL')} <span style={{ fontSize: "0.9rem", color: "#666" }}>CLP</span>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#7D8E7C", fontWeight: 600 }}>Basado en citas registradas</span>
              </div>

              <div className="kpi-card">
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Total Citas Agendadas</span>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.3rem" }}>
                  {totalCitas}
                </div>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>Atenciones acumuladas</span>
              </div>

              <div className="kpi-card">
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Pacientes Únicos</span>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.3rem" }}>
                  {totalPacientes}
                </div>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>Base de datos activa</span>
              </div>

              <div className="kpi-card">
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ticket Promedio</span>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.3rem" }}>
                  ${ticketPromedio.toLocaleString('es-CL')} <span style={{ fontSize: "0.9rem", color: "#666" }}>CLP</span>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>Por atención médica</span>
              </div>
            </div>

            {/* Desglose de Tratamientos Demandados */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid rgba(167, 183, 165, 0.3)", padding: "2rem", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.03)" }}>
              <h3 className="playfair" style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#1F1F1F" }}>
                🩺 Demanda por Especialidad & Tratamiento
              </h3>

              {Object.keys(serviciosConteo).length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {Object.entries(serviciosConteo).map(([servicioNombre, cantidad]) => {
                    const porcentaje = Math.round((cantidad / totalCitas) * 100);
                    const recaudado = cantidad * (preciosServicios[servicioNombre] || 45000);

                    return (
                      <div key={servicioNombre}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                          <span>{servicioNombre} ({cantidad} citas)</span>
                          <span style={{ color: "#8B2434" }}>${recaudado.toLocaleString('es-CL')} CLP ({porcentaje}%)</span>
                        </div>
                        <div style={{ width: "100%", backgroundColor: "#F4EEE8", height: "12px", borderRadius: "9999px", overflow: "hidden" }}>
                          <div style={{ width: `${porcentaje}%`, backgroundColor: "#7D8E7C", height: "100%", borderRadius: "9999px", transition: "width 0.5s ease" }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: "#666" }}>Aún no existen registros de agendamiento para proyectar estadísticas.</p>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 2: AGENDA DE ATENCIÓN */}
        {activeTab === 'agenda' && (
          <div className="no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7D8E7C", letterSpacing: "0.1em" }}>OPERACIONES EN VIVO</span>
                <h1 className="playfair" style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0" }}>Agenda de Atención</h1>
              </div>
              <button onClick={cargarDatos} className="btn-salvia">🔄 Actualizar</button>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid rgba(167, 183, 165, 0.3)", padding: "2rem", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.03)" }}>
              {loading ? (
                <p>Cargando reservas...</p>
              ) : (
                <table className="table-admin">
                  <thead>
                    <tr>
                      <th>Fecha & Hora</th>
                      <th>Paciente</th>
                      <th>Tratamiento</th>
                      <th>Especialista</th>
                      <th>Acción Clínica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r) => (
                      <tr key={r.id}>
                        <td><strong>{r.fecha}</strong> ({r.hora} hrs)</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{r.paciente_nombre}</div>
                          <div style={{ fontSize: "0.8rem", color: "#666" }}>{r.paciente_email}</div>
                        </td>
                        <td>{r.servicio}</td>
                        <td>{r.especialista}</td>
                        <td>
                          <button
                            onClick={() => seleccionarParaFicha(r.paciente_email, r.paciente_nombre)}
                            className="btn-salvia"
                            style={{ fontSize: "0.75rem", padding: "0.4rem 0.85rem" }}
                          >
                            🩺 Abrir Ficha Médica →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: FICHAS & EVOLUCIÓN KINÉSICA */}
        {activeTab === 'fichas' && (
          <div>
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B2434", letterSpacing: "0.1em" }}>REGISTRO CLÍNICO OFICIAL</span>
                <h1 className="playfair" style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0" }}>Ficha Médica & Evolución SOAP</h1>
              </div>

              <button
                onClick={exportarPDF}
                disabled={!selectedPacienteEmail}
                className="btn-pdf"
                title={!selectedPacienteEmail ? "Selecciona un paciente primero" : "Exportar en PDF"}
              >
                📄 Descargar Ficha en PDF
              </button>
            </div>

            {/* Selector de Paciente */}
            <div className="no-print" style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid rgba(167, 183, 165, 0.3)", padding: "1.5rem", marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.5rem" }}>
                Seleccionar Paciente para la Sesión:
              </label>
              <select
                className="input-anluvia"
                value={selectedPacienteEmail}
                onChange={(e) => {
                  const email = e.target.value;
                  const p = pacientesUnicos.find(item => item.email === email);
                  if (p) seleccionarParaFicha(p.email, p.nombre);
                }}
              >
                <option value="">-- Selecciona un Paciente --</option>
                {pacientesUnicos.map((p) => (
                  <option key={p.email} value={p.email}>
                    {p.nombre} ({p.email})
                  </option>
                ))}
              </select>
            </div>

            {selectedPacienteEmail ? (
              <div>
                <div className="no-print" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid rgba(167, 183, 165, 0.3)", padding: "2rem" }}>
                    <h3 className="playfair" style={{ fontSize: "1.3rem", marginTop: 0, color: "#8B2434" }}>
                      + Registrar Nueva Evolución (Sesión #{numSesion})
                    </h3>

                    {mensajeFicha && (
                      <div style={{ padding: "0.75rem", backgroundColor: "#F4EEE8", borderRadius: "10px", color: "#7D8E7C", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem" }}>
                        {mensajeFicha}
                      </div>
                    )}

                    <form onSubmit={guardarEvolucion} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>
                          Escala de Dolor EVA (0 al 10): <strong>{evaDolor} / 10</strong>
                        </label>
                        <input type="range" min="0" max="10" value={evaDolor} onChange={(e) => setEvaDolor(Number(e.target.value))} style={{ width: "100%", accentColor: "#8B2434" }} />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Subjetivo (Relato del paciente):</label>
                        <textarea placeholder="Ej. Refiere disminución del dolor articular tras última sesión..." value={subjetivo} onChange={(e) => setSubjetivo(e.target.value)} className="textarea-anluvia" />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Objetivo (Evaluación física):</label>
                        <textarea placeholder="Ej. Rango de flexión recuperado a 110°. Sensibilidad normal..." value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="textarea-anluvia" />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Tratamiento Aplicado:</label>
                        <textarea placeholder="Ej. Terapia manual, ultrasonido, reeducación motora..." value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} className="textarea-anluvia" />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Indicaciones para el Hogar:</label>
                        <textarea placeholder="Ej. Ejercicios de movilidad 2 veces al día. Crioterapia por 15 min..." value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} className="textarea-anluvia" />
                      </div>

                      <button type="submit" disabled={guardandoEvolucion} className="btn-salvia" style={{ width: "100%", padding: "0.85rem" }}>
                        {guardandoEvolucion ? "Guardando..." : "💾 Guardar Evolución Kinésica"}
                      </button>
                    </form>
                  </div>

                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid rgba(167, 183, 165, 0.3)", padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <h3 className="playfair" style={{ fontSize: "1.3rem", margin: 0, color: "#7D8E7C" }}>
                        Historial Clínico: {selectedPacienteNombre}
                      </h3>
                      <button onClick={exportarPDF} className="btn-pdf" style={{ fontSize: "0.75rem", padding: "0.4rem 0.85rem" }}>
                        🖨️ PDF
                      </button>
                    </div>

                    {evolucionesPacienteActual.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "500px", overflowY: "auto" }}>
                        {evolucionesPacienteActual.map((evo) => (
                          <div key={evo.id} style={{ border: "1px solid #F4EEE8", borderRadius: "12px", padding: "1rem", backgroundColor: "#FBF9F6" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                              <span style={{ fontWeight: 700, color: "#8B2434" }}>Sesión #{evo.numero_sesion}</span>
                              <span style={{ fontSize: "0.8rem", color: "#666" }}>{new Date(evo.created_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: "0.85rem" }}><strong>Dolor EVA:</strong> {evo.eva_dolor}/10</div>
                            {evo.tratamiento && <div style={{ fontSize: "0.85rem", color: "#4A4A4A", marginTop: "0.2rem" }}><strong>Tratamiento:</strong> {evo.tratamiento}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "#666", fontSize: "0.9rem" }}>No hay registros previos para este paciente.</p>
                    )}
                  </div>
                </div>

                {/* --- DOCUMENTO PARA IMPRESIÓN / DESCARGA PDF --- */}
                <div id="area-pdf-oficial" style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "2px solid #7D8E7C", padding: "3rem", marginTop: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #8B2434", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
                    <div>
                      <h1 className="playfair" style={{ fontSize: "2rem", margin: 0, color: "#1F1F1F", letterSpacing: "0.05em" }}>ANLUVIA</h1>
                      <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700 }}>
                        Clinique & Wellness
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                        Av. Las Condes #12345, Of. 602 — Santiago, Chile
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#7D8E7C" }}>INFORME DE EVOLUCIÓN CLÍNICA</div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>Fecha Emisión: {new Date().toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F4EEE8", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#8B2434", fontWeight: 700, letterSpacing: "0.1em" }}>DATOS DEL PACIENTE</span>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.2rem" }}>{selectedPacienteNombre}</div>
                      <div style={{ fontSize: "0.85rem", color: "#555" }}>{selectedPacienteEmail}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.75rem", color: "#7D8E7C", fontWeight: 700, letterSpacing: "0.1em" }}>ESPECIALISTA TRATANTE</span>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.2rem" }}>{especialista}</div>
                      <div style={{ fontSize: "0.85rem", color: "#555" }}>Kinesiología & Rehabilitación</div>
                    </div>
                  </div>

                  <h3 className="playfair" style={{ fontSize: "1.25rem", color: "#8B2434", marginBottom: "1rem" }}>
                    Historial de Sesiones Registradas ({evolucionesPacienteActual.length})
                  </h3>

                  {evolucionesPacienteActual.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {evolucionesPacienteActual.map((evo) => (
                        <div key={evo.id} style={{ border: "1px solid #A7B7A5", borderRadius: "12px", padding: "1.25rem", backgroundColor: "#FFF" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #A7B7A5", paddingBottom: "0.5rem", marginBottom: "0.75rem" }}>
                            <span style={{ fontWeight: 700, color: "#8B2434", fontSize: "1rem" }}>Sesión #{evo.numero_sesion}</span>
                            <span style={{ fontSize: "0.85rem", color: "#666" }}>Fecha: {new Date(evo.created_at).toLocaleDateString()} | EVA Dolor: <strong>{evo.eva_dolor}/10</strong></span>
                          </div>
                          <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.9rem", color: "#333" }}>
                            {evo.subjetivo && <div><strong>S (Subjetivo):</strong> {evo.subjetivo}</div>}
                            {evo.objetivo && <div><strong>O (Objetivo):</strong> {evo.objetivo}</div>}
                            {evo.tratamiento && <div><strong>A/P (Tratamiento):</strong> {evo.tratamiento}</div>}
                            {evo.indicaciones && <div style={{ backgroundColor: "#FBF9F6", padding: "0.5rem 0.75rem", borderRadius: "8px", borderLeft: "3px solid #7D8E7C", marginTop: "0.25rem" }}><strong>Indicaciones:</strong> {evo.indicaciones}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>Sin evoluciones registradas aún para este paciente.</p>
                  )}

                  <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>
                      Documento generado electrónicamente por ANLUVIA Ecosistema Clínico.
                    </div>
                    <div style={{ textAlign: "center", width: "220px" }}>
                      <div style={{ borderBottom: "1px solid #000", marginBottom: "0.5rem" }}></div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>Firma del Especialista</div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>{especialista}</div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="no-print" style={{ textAlign: "center", padding: "4rem", backgroundColor: "#FFF", borderRadius: "20px", border: "1px dashed #A7B7A5" }}>
                <p style={{ color: "#666" }}>Selecciona un paciente del menú superior para abrir o exportar su Ficha Médica.</p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { crearGoogleCalendarLink } from "../../lib/calendar";

export default function PortalPage() {
  const [user, setUser] = useState<any>(null);
  const [reservas, setReservas] = useState<any[]>([]);
  const [evoluciones, setEvoluciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const portalCss = `
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
    .playfair { font-family: "Playfair Display", serif; }

    .card-portal {
      background-color: #FFFFFF;
      border: 1px solid rgba(167, 183, 165, 0.3);
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: 0 10px 30px -10px rgba(31, 31, 31, 0.03);
    }

    .btn-salvia {
      background-color: #7D8E7C;
      color: #FFFFFF;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      border: none;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }
    .btn-salvia:hover {
      background-color: #6a7b69;
    }

    .btn-gcal {
      background-color: #FFFFFF;
      color: #1a73e8;
      border: 1px solid #1a73e8;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.8rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    .btn-gcal:hover {
      background-color: #f1f8fe;
    }

    .badge-status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-block;
    }
  `;

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user?.email) {
        const { data: resData } = await supabase
          .from('reservas')
          .select('*')
          .eq('paciente_email', user.email)
          .order('created_at', { ascending: false });

        if (resData) setReservas(resData);

        const { data: evoData } = await supabase
          .from('evoluciones')
          .select('*')
          .eq('paciente_email', user.email)
          .order('created_at', { ascending: false });

        if (evoData) setEvoluciones(evoData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style dangerouslySetInnerHTML={{ __html: portalCss }} />

      <header style={{ padding: "1.25rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F4EEE8", backgroundColor: "#FFFFFF" }}>
        <a href="/" style={{ textDecoration: "none", color: "#1F1F1F" }} className="playfair">
          <span style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>ANLUVIA</span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 600, marginLeft: "0.75rem" }}>
            Portal del Paciente
          </span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            {user ? user.email : "Invitado"}
          </span>
          {user ? (
            <button onClick={cerrarSesion} style={{ background: "none", border: "1px solid #8B2434", color: "#8B2434", padding: "0.5rem 1rem", borderRadius: "9999px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
              Cerrar Sesión
            </button>
          ) : (
            <a href="/login" style={{ color: "#7D8E7C", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
              Iniciar Sesión
            </a>
          )}
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem", width: "100%" }}>
        
        {/* Banner de Bienvenida */}
        <div style={{ backgroundColor: "#F4EEE8", borderRadius: "24px", padding: "2.5rem", marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#8B2434", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>MI PORTAL DE SALUD</span>
            <h1 className="playfair" style={{ fontSize: "2.25rem", margin: "0.5rem 0 0.25rem 0" }}>
              Bienvenido(a){user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
            </h1>
            <p style={{ color: "#666", margin: 0, fontSize: "0.95rem" }}>
              Revisa tus citas programadas e historial clínico.
            </p>
          </div>
          <a href="/reservar" className="btn-salvia">
            + Agendar Nueva Cita
          </a>
        </div>

        {/* Sección de Citas Activas */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 className="playfair" style={{ fontSize: "1.5rem", marginBottom: "1.25rem" }}>Tus Citas Programadas</h2>

          {loading ? (
            <p>Cargando tus citas...</p>
          ) : reservas.length > 0 ? (
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {reservas.map((r) => {
                const gCalUrl = crearGoogleCalendarLink({
                  titulo: r.servicio,
                  especialista: r.especialista,
                  fecha: r.fecha,
                  hora: r.hora
                });

                return (
                  <div key={r.id} className="card-portal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <span className="badge-status" style={{ backgroundColor: "#E6F4EA", color: "#137333", marginBottom: "0.5rem" }}>
                        {r.estado || 'Confirmada'}
                      </span>
                      <h3 style={{ fontSize: "1.2rem", margin: "0.25rem 0", color: "#1F1F1F" }}>{r.servicio}</h3>
                      <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
                        Especialista: <strong>{r.especialista}</strong>
                      </p>
                    </div>

                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#8B2434" }}>{r.fecha}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>{r.hora} hrs</div>
                      
                      <a href={gCalUrl} target="_blank" rel="noopener noreferrer" className="btn-gcal">
                        📅 Guardar en Google Calendar
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card-portal" style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#666" }}>Aún no tienes citas agendadas.</p>
            </div>
          )}
        </div>

        {/* Historial Kinésico */}
        <div>
          <h2 className="playfair" style={{ fontSize: "1.5rem", marginBottom: "1.25rem", color: "#8B2434" }}>
            🩺 Mi Evolución Kinésica & Indicaciones
          </h2>

          {evoluciones.length > 0 ? (
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {evoluciones.map((evo) => (
                <div key={evo.id} className="card-portal" style={{ borderLeft: "5px solid #7D8E7C" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span className="badge-status" style={{ backgroundColor: "#E6F4EA", color: "#137333" }}>
                      Sesión #{evo.numero_sesion} Registrada
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#666" }}>{new Date(evo.created_at).toLocaleDateString()}</span>
                  </div>
                  {evo.indicaciones && (
                    <div style={{ backgroundColor: "#F4EEE8", padding: "1rem", borderRadius: "12px", marginTop: "0.5rem" }}>
                      <strong style={{ color: "#8B2434", fontSize: "0.9rem" }}>📋 Indicaciones:</strong>
                      <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#4A4A4A" }}>{evo.indicaciones}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card-portal" style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#666" }}>Aún no tienes registros de evolución kinésica.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
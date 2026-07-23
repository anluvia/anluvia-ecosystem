'use client';

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { crearMensajeReservaWhatsApp } from "../../lib/whatsapp";

export default function ReservarPage() {
  const [step, setStep] = useState(1);
  const [servicio, setServicio] = useState('');
  const [profesional, setProfesional] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [reservaExitosa, setReservaExitosa] = useState(false);

  const servicios = [
    { id: 'kine', nombre: 'Kinesiología & Recuperación Física', duracion: '60 min', precio: '$45.000' },
    { id: 'facial', nombre: 'Estética Facial Premium & Armonización', duracion: '45 min', precio: '$55.000' },
    { id: 'corporal', nombre: 'Remodelación Corporal & Drenaje', duracion: '60 min', precio: '$50.000' },
    { id: 'bienestar', nombre: 'Masoterapia & Bienestar Integral', duracion: '75 min', precio: '$40.000' },
  ];

  const profesionales = [
    { id: 'matias', nombre: 'Dr. Matías Arancibia', cargo: 'Kinesiólogo Especialista' },
    { id: 'camila', nombre: 'Dra. Camila Morales', cargo: 'Dermatofuncional & Estética' },
    { id: 'sofia', nombre: 'Dra. Sofía Ugarte', cargo: 'Medicina Preventiva & Bienestar' },
  ];

  const horasDisponibles = ['09:00', '10:30', '12:00', '15:30', '17:00', '18:30'];

  const reservarCss = `
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap");
    .playfair { font-family: "Playfair Display", serif; }

    .card-option {
      background-color: #FFFFFF;
      border: 1px solid rgba(167, 183, 165, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .card-option:hover {
      border-color: #7D8E7C;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -10px rgba(125, 142, 124, 0.2);
    }
    .card-selected {
      border: 2px solid #7D8E7C !important;
      background-color: #F4EEE8 !important;
    }

    .btn-salvia {
      background-color: #7D8E7C;
      color: #FFFFFF;
      padding: 0.85rem 2rem;
      border-radius: 9999px;
      border: none;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-salvia:hover { background-color: #6a7b69; }

    .btn-wsp {
      background-color: #25D366;
      color: #FFFFFF;
      padding: 0.85rem 2rem;
      border-radius: 9999px;
      border: none;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .btn-wsp:hover { background-color: #1eb855; }

    .btn-outline {
      background: transparent;
      color: #666;
      border: 1px solid #ccc;
      padding: 0.85rem 1.5rem;
      border-radius: 9999px;
      font-weight: 500;
      cursor: pointer;
    }

    .input-anluvia {
      width: 100%;
      padding: 0.8rem 1.2rem;
      border-radius: 12px;
      border: 1px solid #ccc;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
      background-color: #FFF;
    }
  `;

  const guardarReserva = async () => {
    setLoading(true);
    setMensaje('');

    try {
      const { error } = await supabase.from('reservas').insert([
        {
          servicio,
          especialista: profesional,
          fecha,
          hora,
          paciente_nombre: nombre,
          paciente_email: email,
          estado: 'Confirmada'
        }
      ]);

      if (error) throw error;

      // Intentar envío de email
      fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteNombre: nombre,
          pacienteEmail: email,
          servicio,
          especialista: profesional,
          fecha,
          hora
        })
      }).catch(err => console.error("Email error:", err));

      setReservaExitosa(true);
      setMensaje("🎉 ¡Reserva confirmada con éxito!");

    } catch (err: any) {
      console.error(err);
      setMensaje("⚠️ " + (err.message || "Error al procesar la cita."));
    } finally {
      setLoading(false);
    }
  };

  const linkWa = crearMensajeReservaWhatsApp({
    pacienteNombre: nombre,
    servicio,
    especialista: profesional,
    fecha,
    hora
  });

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "Inter, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style dangerouslySetInnerHTML={{ __html: reservarCss }} />

      <header style={{ padding: "1.25rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F4EEE8" }}>
        <a href="/" style={{ textDecoration: "none", color: "#1F1F1F" }} className="playfair">
          <span style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>ANLUVIA</span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 600, marginLeft: "0.75rem" }}>
            Reserva Online
          </span>
        </a>
        <a href="/" style={{ textDecoration: "none", color: "#666666", fontSize: "0.9rem" }}>✕ Cancelar</a>
      </header>

      <main style={{ flex: 1, maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem", width: "100%" }}>
        
        {!reservaExitosa ? (
          <>
            <div style={{ backgroundColor: "#F4EEE8", padding: "1rem 2rem", borderRadius: "16px", display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "2rem" }}>
              <span style={{ color: step >= 1 ? "#7D8E7C" : "#999" }}>1. Tratamiento</span>
              <span>→</span>
              <span style={{ color: step >= 2 ? "#7D8E7C" : "#999" }}>2. Especialista</span>
              <span>→</span>
              <span style={{ color: step >= 3 ? "#7D8E7C" : "#999" }}>3. Datos</span>
              <span>→</span>
              <span style={{ color: step >= 4 ? "#8B2434" : "#999" }}>4. Confirmar</span>
            </div>

            {step === 1 && (
              <div>
                <h1 className="playfair" style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Selecciona tu Tratamiento</h1>
                <p style={{ color: "#666", marginBottom: "2rem" }}>Elige la especialidad médica o sesión de bienestar que deseas agendar.</p>

                <div style={{ display: "grid", gap: "1rem" }}>
                  {servicios.map((s) => (
                    <div
                      key={s.id}
                      className={`card-option ${servicio === s.nombre ? 'card-selected' : ''}`}
                      onClick={() => setServicio(s.nombre)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "#1F1F1F" }}>{s.nombre}</div>
                        <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>Duración: {s.duracion}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: "#8B2434", fontSize: "1.1rem" }}>{s.precio}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn-salvia" disabled={!servicio} onClick={() => setStep(2)} style={{ opacity: servicio ? 1 : 0.5 }}>
                    Siguiente: Especialista →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="playfair" style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Elige a tu Profesional</h1>
                <p style={{ color: "#666", marginBottom: "2rem" }}>Selecciona el especialista de tu preferencia para el tratamiento.</p>

                <div style={{ display: "grid", gap: "1rem" }}>
                  {profesionales.map((p) => (
                    <div
                      key={p.id}
                      className={`card-option ${profesional === p.nombre ? 'card-selected' : ''}`}
                      onClick={() => setProfesional(p.nombre)}
                      style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
                    >
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#7D8E7C", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {p.nombre.split(' ')[1][0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>{p.nombre}</div>
                        <div style={{ fontSize: "0.85rem", color: "#666" }}>{p.cargo}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "space-between" }}>
                  <button className="btn-outline" onClick={() => setStep(1)}>← Volver</button>
                  <button className="btn-salvia" disabled={!profesional} onClick={() => setStep(3)} style={{ opacity: profesional ? 1 : 0.5 }}>
                    Siguiente: Datos y Fecha →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="playfair" style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Tus Datos y Fecha</h1>
                <p style={{ color: "#666", marginBottom: "2rem" }}>Ingresa tu información de contacto y selecciona el horario de tu cita.</p>

                <div style={{ display: "grid", gap: "1.25rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
                      Tu Nombre Completo *
                    </label>
                    <input type="text" placeholder="Ej. Valentina Silva" value={nombre} onChange={(e) => setNombre(e.target.value)} className="input-anluvia" />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
                      Correo Electrónico *
                    </label>
                    <input type="email" placeholder="Ej. paciente@anluvia.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-anluvia" />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
                      Fecha de Atención *
                    </label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input-anluvia" />
                  </div>
                </div>

                {fecha && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#666", marginBottom: "0.75rem" }}>
                      Horarios Disponibles *
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.75rem" }}>
                      {horasDisponibles.map((h) => (
                        <button
                          key={h}
                          onClick={() => setHora(h)}
                          style={{
                            padding: "0.75rem",
                            borderRadius: "12px",
                            border: hora === h ? "2px solid #7D8E7C" : "1px solid #ddd",
                            backgroundColor: hora === h ? "#F4EEE8" : "#FFF",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          {h} hrs
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "space-between" }}>
                  <button className="btn-outline" onClick={() => setStep(2)}>← Volver</button>
                  <button
                    className="btn-salvia"
                    disabled={!fecha || !hora || !nombre || !email}
                    onClick={() => setStep(4)}
                    style={{ opacity: (fecha && hora && nombre && email) ? 1 : 0.5 }}
                  >
                    Siguiente: Resumen →
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "3rem" }}>✨</span>
                <h1 className="playfair" style={{ fontSize: "2.25rem", marginTop: "1rem" }}>Confirmar Reserva</h1>
                <p style={{ color: "#666", marginBottom: "2rem" }}>Revisa los detalles antes de registrar tu hora médica.</p>

                <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #A7B7A5", borderRadius: "20px", padding: "2rem", textAlign: "left", marginBottom: "2rem", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}>
                  <div style={{ borderBottom: "1px solid #F4EEE8", paddingBottom: "1rem", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#8B2434", fontWeight: 600, letterSpacing: "0.1em" }}>PACIENTE</span>
                    <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1F1F1F" }}>{nombre} ({email})</div>
                  </div>
                  <div style={{ borderBottom: "1px solid #F4EEE8", paddingBottom: "1rem", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#7D8E7C", fontWeight: 600, letterSpacing: "0.1em" }}>TRATAMIENTO</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1F1F1F" }}>{servicio}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: 600, letterSpacing: "0.1em" }}>FECHA Y HORA</span>
                    <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1F1F1F" }}>{fecha} a las {hora} hrs con {profesional}</div>
                  </div>
                </div>

                <button onClick={guardarReserva} disabled={loading} className="btn-salvia" style={{ width: "100%", fontSize: "1rem", padding: "1rem" }}>
                  {loading ? "Registrando cita..." : "Confirmar Cita e Ingresar"}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Pantalla de Éxito con opción de WhatsApp */
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <span style={{ fontSize: "4rem" }}>🎉</span>
            <h1 className="playfair" style={{ fontSize: "2.5rem", marginTop: "1rem", color: "#8B2434" }}>¡Cita Agendada con Éxito!</h1>
            <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "2.5rem" }}>
              Tu hora ha sido guardada en nuestro sistema. Para mayor tranquilidad, puedes avisarle directamente a la clínica por WhatsApp:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", margin: "0 auto" }}>
              <a href={linkWa} target="_blank" rel="noopener noreferrer" className="btn-wsp">
                💬 Notificar a la Clínica por WhatsApp
              </a>

              <a href="/portal" className="btn-salvia" style={{ textAlign: "center" }}>
                Ir a mi Portal del Paciente →
              </a>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
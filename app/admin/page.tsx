'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type TipoRol = 'admin' | 'especialista' | 'recepcion' | 'editor';

interface UsuarioEquipo {
  id: string;
  nombre: string;
  email: string;
  clave: string;
  roles: TipoRol[];
}

const usuariosBaseIniciales: UsuarioEquipo[] = [
  { id: '1', nombre: 'Dr. Matías Arancibia', email: 'director@anluvia.cl', clave: 'anluvia2026', roles: ['admin', 'especialista'] },
  { id: '2', nombre: 'Kinesiólogo Tratante', email: 'kine@anluvia.cl', clave: 'kine2026', roles: ['especialista'] },
  { id: '3', nombre: 'Recepción & Caja', email: 'recepcion@anluvia.cl', clave: 'recepcion2026', roles: ['recepcion'] },
  { id: '4', nombre: 'Editor Web & CMS', email: 'editor@anluvia.cl', clave: 'editor2026', roles: ['editor'] },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UsuarioEquipo | null>(null);
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [reservas, setReservas] = useState<any[]>([]);
  const [evoluciones, setEvoluciones] = useState<any[]>([]);
  const [gastos, setGastos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioEquipo[]>([]);

  // Formulario Crear Usuario
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [rolesSeleccionados, setRolesSeleccionados] = useState<TipoRol[]>(['especialista']);
  const [mensajeUsuario, setMensajeUsuario] = useState("");

  // Formulario Ficha
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState("");
  const [selectedPacienteNombre, setSelectedPacienteNombre] = useState("");
  const [numSesion, setNumSesion] = useState(1);
  const [evaDolor, setEvaDolor] = useState(5);
  const [subjetivo, setSubjetivo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [mensajeFicha, setMensajeFicha] = useState("");

  useEffect(() => {
    const localUsers = localStorage.getItem("anluvia_equipo_users");
    let userList: UsuarioEquipo[] = [];
    if (localUsers) {
      try { userList = JSON.parse(localUsers); } catch { userList = usuariosBaseIniciales; }
    } else {
      userList = usuariosBaseIniciales;
      localStorage.setItem("anluvia_equipo_users", JSON.stringify(usuariosBaseIniciales));
    }
    setUsuarios(userList);

    const savedUserJson = localStorage.getItem("anluvia_active_user");
    if (savedUserJson) {
      try {
        const activeUser = JSON.parse(savedUserJson);
        setIsAuthenticated(true);
        setCurrentUser(activeUser);
      } catch {}
    }
  }, []);

  const cargarDatos = async () => {
    try {
      const { data: resData } = await supabase.from("reservas").select("*").order("created_at", { ascending: false });
      if (resData) setReservas(resData);

      const { data: evoData } = await supabase.from("evoluciones").select("*").order("created_at", { ascending: false });
      if (evoData) setEvoluciones(evoData);

      const localGastos = localStorage.getItem("anluvia_gastos");
      if (localGastos) setGastos(JSON.parse(localGastos));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      cargarDatos();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const userFound = usuarios.find((u) => u.clave === inputPassword.trim());
    if (userFound) {
      setIsAuthenticated(true);
      setCurrentUser(userFound);
      localStorage.setItem("anluvia_active_user", JSON.stringify(userFound));
    } else {
      setLoginError("🔑 Clave no reconocida. Verifica tus credenciales.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("anluvia_active_user");
  };

  const handleCrearUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevaClave || rolesSeleccionados.length === 0) return;
    const nuevo: UsuarioEquipo = {
      id: Date.now().toString(),
      nombre: nuevoNombre,
      email: nuevoEmail || `${nuevoNombre.toLowerCase().replace(/\s+/g, '')}@anluvia.cl`,
      clave: nuevaClave,
      roles: rolesSeleccionados,
    };
    const actualizados = [nuevo, ...usuarios];
    setUsuarios(actualizados);
    localStorage.setItem("anluvia_equipo_users", JSON.stringify(actualizados));
    setMensajeUsuario(`✅ Usuario "${nuevoNombre}" registrado.`);
    setNuevoNombre("");
    setNuevoEmail("");
    setNuevaClave("");
  };

  const eliminarUsuario = (id: string) => {
    if (usuarios.length <= 1) {
      alert("Debe haber al menos un usuario.");
      return;
    }
    const filtrados = usuarios.filter((u) => u.id !== id);
    setUsuarios(filtrados);
    localStorage.setItem("anluvia_equipo_users", JSON.stringify(filtrados));
  };

  const toggleRolCheck = (rol: TipoRol) => {
    if (rolesSeleccionados.includes(rol)) {
      setRolesSeleccionados(rolesSeleccionados.filter((r) => r !== rol));
    } else {
      setRolesSeleccionados([...rolesSeleccionados, rol]);
    }
  };

  const hasRole = (rol: TipoRol): boolean => {
    return currentUser?.roles ? currentUser.roles.includes(rol) : false;
  };

  const pacientesUnicos = Array.from(new Set(reservas.map((r) => r.paciente_email))).map((email) => {
    const reserva = reservas.find((r) => r.paciente_email === email);
    return { email, nombre: reserva?.paciente_nombre || "Paciente ANLUVIA" };
  });

  const ingresosBrutos = reservas.length * 45000;
  const egresosTotales = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  const gananciaNeta = ingresosBrutos - egresosTotales;
  const margenRentabilidad = ingresosBrutos > 0 ? Math.round((gananciaNeta / ingresosBrutos) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: "#FBF9F6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ backgroundColor: "#FFFFFF", padding: "3rem", borderRadius: "24px", border: "1px solid #F4EEE8", width: "100%", maxWidth: "440px", textAlign: "center" }}>
          <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "serif", color: "#1F1F1F" }}>ANLUVIA</span>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem", marginBottom: "2rem" }}>
            GESTIÓN DE EQUIPO & ACCESO
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {loginError ? <div style={{ padding: "0.75rem", backgroundColor: "#FDF2F2", color: "#D93025", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600 }}>{loginError}</div> : null}
            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>Ingresa tu Clave:</label>
              <input type="password" placeholder="••••••••" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} style={{ width: "100%", padding: "0.85rem", borderRadius: "12px", border: "1px solid #ccc", fontSize: "1rem" }} required />
            </div>
            <button type="submit" style={{ backgroundColor: "#8B2434", color: "#FFFFFF", padding: "0.9rem", borderRadius: "9999px", border: "none", fontWeight: 700, cursor: "pointer" }}>Ingresar al Panel →</button>
          </form>

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #F4EEE8", fontSize: "0.75rem", color: "#666", textAlign: "left" }}>
            🔐 <strong>Claves iniciales:</strong><br />
            • Admin: <code>anluvia2026</code><br />
            • Kinesiología: <code>kine2026</code><br />
            • Recepción: <code>recepcion2026</code><br />
            • Editor: <code>editor2026</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "sans-serif", minHeight: "100vh", display: "flex" }}>
      <aside style={{ width: "260px", borderRight: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "serif" }}>ANLUVIA</span>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem" }}>
              ROLES: {currentUser?.roles ? currentUser.roles.join(" + ").toUpperCase() : "INVITADO"}
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {hasRole('admin') ? (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'dashboard' ? 700 : 500, backgroundColor: activeTab === 'dashboard' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('dashboard')}>
                📊 Dashboard & Métricas
              </div>
            ) : null}

            {hasRole('admin') ? (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'equipo' ? 700 : 500, backgroundColor: activeTab === 'equipo' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('equipo')}>
                👥 Gestión Equipo & Roles
              </div>
            ) : null}

            {hasRole('admin') || hasRole('especialista') ? (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'fichas' ? 700 : 500, backgroundColor: activeTab === 'fichas' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('fichas')}>
                🩺 Fichas Kinésicas (SOAP)
              </div>
            ) : null}

            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'agenda' ? 700 : 500, backgroundColor: activeTab === 'agenda' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('agenda')}>
              📅 Agenda & Citas ({reservas.length})
            </div>
          </nav>
        </div>

        <div style={{ borderTop: "1px solid #F4EEE8", paddingTop: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{currentUser?.nombre}</div>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#8B2434", fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, marginTop: "0.5rem" }}>
            🔒 Cerrar Sesión
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>
        {activeTab === 'dashboard' && hasRole('admin') ? (
          <div>
            <h1 style={{ fontSize: "2.25rem", margin: "0 0 2rem 0", fontFamily: "serif" }}>Indicadores de Negocio</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Ventas Brutas</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.3rem" }}>${ingresosBrutos.toLocaleString('es-CL')} CLP</div>
              </div>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", textTransform: "uppercase" }}>Gastos</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#8B2434", marginTop: "0.3rem" }}>${egresosTotales.toLocaleString('es-CL')} CLP</div>
              </div>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#137333", textTransform: "uppercase" }}>Ganancia Neta</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: gananciaNeta >= 0 ? "#137333" : "#D93025", marginTop: "0.3rem" }}>${gananciaNeta.toLocaleString('es-CL')} CLP</div>
              </div>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Margen</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.3rem" }}>{margenRentabilidad}%</div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'equipo' && hasRole('admin') ? (
          <div>
            <h1 style={{ fontSize: "2.25rem", margin: "0 0 2rem 0", fontFamily: "serif" }}>Gestión de Equipo & Multirroles</h1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#8B2434", fontFamily: "serif" }}>+ Agregar Integrante</h3>
                {mensajeUsuario ? <div style={{ padding: "0.75rem", backgroundColor: "#F4EEE8", borderRadius: "10px", color: "#7D8E7C", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem" }}>{mensajeUsuario}</div> : null}
                <form onSubmit={handleCrearUsuario} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>Nombre Completo *</label>
                    <input type="text" placeholder="Ej. Dra. Camila Morales" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>Email</label>
                    <input type="email" placeholder="camila@anluvia.cl" value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>Clave Privada *</label>
                    <input type="text" placeholder="Ej. camila2026" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.5rem" }}>Asignar Rol(es) *</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", backgroundColor: "#FBF9F6", padding: "0.85rem", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('especialista')} onChange={() => toggleRolCheck('especialista')} />
                        🩺 Kinesiología / Especialista
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('recepcion')} onChange={() => toggleRolCheck('recepcion')} />
                        📋 Recepción & Caja
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('editor')} onChange={() => toggleRolCheck('editor')} />
                        ✍️ Editor Web / CMS
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#8B2434", fontWeight: 700 }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('admin')} onChange={() => toggleRolCheck('admin')} />
                        👑 Director / Admin
                      </label>
                    </div>
                  </div>
                  <button type="submit" style={{ width: "100%", backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.85rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer" }}>👤 Guardar Integrante</button>
                </form>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#1F1F1F", marginBottom: "1.5rem", fontFamily: "serif" }}>
                  Integrantes del Equipo ({usuarios.length})
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F4EEE8" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Clave</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Roles</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #F4EEE8" }}>
                        <td style={{ padding: "0.75rem" }}><strong>{u.nombre}</strong><div style={{ fontSize: "0.75rem", color: "#666" }}>{u.email}</div></td>
                        <td style={{ padding: "0.75rem" }}><code style={{ backgroundColor: "#F4EEE8", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>{u.clave}</code></td>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                            {u.roles.map((r) => (
                              <span key={r} style={{ backgroundColor: r === 'admin' ? '#FDF2F2' : '#E6F4EA', color: r === 'admin' ? '#8B2434' : '#137333', padding: "0.15rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => eliminarUsuario(u.id)} style={{ background: "none", border: "none", color: "#D93025", cursor: "pointer" }}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'fichas' && (hasRole('admin') || hasRole('especialista')) ? (
          <div>
            <h1 style={{ fontSize: "2.25rem", margin: "0 0 2rem 0", fontFamily: "serif" }}>Ficha Médica Kinésica</h1>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.5rem" }}>Seleccionar Paciente:</label>
              <select value={selectedPacienteEmail} onChange={(e) => {
                const email = e.target.value;
                const p = pacientesUnicos.find((item) => item.email === email);
                if (p) {
                  setSelectedPacienteEmail(p.email);
                  setSelectedPacienteNombre(p.nombre);
                }
              }} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }}>
                <option value="">-- Selecciona un Paciente --</option>
                {pacientesUnicos.map((p) => (
                  <option key={p.email} value={p.email}>{p.nombre} ({p.email})</option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {activeTab === 'agenda' ? (
          <div>
            <h1 style={{ fontSize: "2.25rem", margin: "0 0 2rem 0", fontFamily: "serif" }}>Agenda Operativa</h1>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F4EEE8" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>Fecha & Hora</th>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>Paciente</th>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>Tratamiento</th>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>Especialista</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #F4EEE8" }}>
                      <td style={{ padding: "0.75rem" }}><strong>{r.fecha}</strong> ({r.hora} hrs)</td>
                      <td style={{ padding: "0.75rem" }}>{r.paciente_nombre}</td>
                      <td style={{ padding: "0.75rem" }}>{r.servicio}</td>
                      <td style={{ padding: "0.75rem" }}>{r.especialista}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
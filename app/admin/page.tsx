'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { emitirBoletaSII, emitirFacturaSII } from "../../lib/sii";

type TipoRol = 'admin' | 'especialista' | 'recepcion' | 'editor';

interface UsuarioEquipo {
  id: string;
  nombre: string;
  email: string;
  clave: string;
  roles: TipoRol[];
}

export default function AdminDashboard() {
  // ESTADOS DE SESIÓN Y USUARIO ACTIVO
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UsuarioEquipo | null>(null);
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [reservas, setReservas] = useState<any[]>([]);
  const [evoluciones, setEvoluciones] = useState<any[]>([]);
  const [gastos, setGastos] = useState<any[]>([]);
  const [ventas, setVentas] = useState<any[]>([]);
  const [campanas, setCampanas] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioEquipo[]>([]);
  const [loading, setLoading] = useState(false);

  // Formulario Crear Miembro de Equipo
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [rolesSeleccionados, setRolesSeleccionados] = useState<TipoRol[]>(['especialista']);
  const [mensajeUsuario, setMensajeUsuario] = useState("");

  // Estados SII
  const [loadingSii, setLoadingSii] = useState(false);
  const [resultadoSii, setResultadoSii] = useState<any>(null);

  // Formulario Ficha
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState("");
  const [selectedPacienteNombre, setSelectedPacienteNombre] = useState("");
  const [numSesion, setNumSesion] = useState(1);
  const [evaDolor, setEvaDolor] = useState(5);
  const [subjetivo, setSubjetivo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [guardandoEvolucion, setGuardandoEvolucion] = useState(false);
  const [mensajeFicha, setMensajeFicha] = useState("");

  // Formulario Gastos
  const [gastoConcepto, setGastoConcepto] = useState("");
  const [gastoCategoria, setGastoCategoria] = useState("Insumos Médicos");
  const [gastoMonto, setGastoMonto] = useState("");
  const [gastoFecha, setGastoFecha] = useState(new Date().toISOString().split("T")[0]);
  const [guardandoGasto, setGuardandoGasto] = useState(false);
  const [mensajeGasto, setMensajeGasto] = useState("");

  // Formulario Marketing
  const [campNombre, setCampNombre] = useState("");
  const [campPlataforma, setCampPlataforma] = useState("Meta Ads (Instagram/FB)");
  const [campInversion, setCampInversion] = useState("");
  const [campClics, setCampClics] = useState("");
  const [campCitas, setCampCitas] = useState("");
  const [guardandoCampana, setGuardandoCampana] = useState(false);
  const [mensajeCampana, setMensajeCampana] = useState("");

  // Formulario Blog
  const [blogTitulo, setBlogTitulo] = useState("");
  const [blogCategoria, setBlogCategoria] = useState("Kinesiología");
  const [blogContenido, setBlogContenido] = useState("");
  const [mensajeBlog, setMensajeBlog] = useState("");

  const preciosServicios: { [key: string]: number } = {
    'Kinesiología & Recuperación Física': 45000,
    'Estética Facial Premium & Armonización': 55000,
    'Remodelación Corporal & Drenaje': 50000,
    'Masoterapia & Bienestar Integral': 40000,
  };

  // Usuarios base iniciales si no existen
  const usuariosBaseIniciales: UsuarioEquipo[] = [
    { id: '1', nombre: 'Dr. Matías Arancibia', email: 'director@anluvia.cl', clave: 'anluvia2026', roles: ['admin', 'especialista'] },
    { id: '2', nombre: 'Kinesiólogo Tratante', email: 'kine@anluvia.cl', clave: 'kine2026', roles: ['especialista'] },
    { id: '3', nombre: 'Recepción & Caja', email: 'recepcion@anluvia.cl', clave: 'recepcion2026', roles: ['recepcion'] },
    { id: '4', nombre: 'Editor Web & CMS', email: 'editor@anluvia.cl', clave: 'editor2026', roles: ['editor'] },
  ];

  useEffect(() => {
    // Cargar Lista de Usuarios
    const localUsers = localStorage.getItem("anluvia_equipo_users");
    let userList: UsuarioEquipo[] = [];
    if (localUsers) {
      userList = JSON.parse(localUsers);
    } else {
      userList = usuariosBaseIniciales;
      localStorage.setItem("anluvia_equipo_users", JSON.stringify(usuariosBaseIniciales));
    }
    setUsuarios(userList);

    // Cargar Sesión Activa
    const savedUserJson = localStorage.getItem("anluvia_active_user");
    if (savedUserJson) {
      const activeUser = JSON.parse(savedUserJson);
      setIsAuthenticated(true);
      setCurrentUser(activeUser);
      establecerTabInicial(activeUser.roles);
      cargarDatos();
    }
  }, []);

  const establecerTabInicial = (roles: TipoRol[]) => {
    if (roles.includes('admin')) setActiveTab('dashboard');
    else if (roles.includes('especialista')) setActiveTab('fichas');
    else if (roles.includes('recepcion')) setActiveTab('agenda');
    else if (roles.includes('editor')) setActiveTab('contenido');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const userFound = usuarios.find(u => u.clave === inputPassword.trim());

    if (userFound) {
      setIsAuthenticated(true);
      setCurrentUser(userFound);
      localStorage.setItem("anluvia_active_user", JSON.stringify(userFound));
      establecerTabInicial(userFound.roles);
      cargarDatos();
    } else {
      setLoginError("🔑 Clave no reconocida. Por favor verifica tus credenciales.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("anluvia_active_user");
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { data: resData } = await supabase.from("reservas").select("*").order("created_at", { ascending: false });
      if (resData) setReservas(resData);

      const { data: evoData } = await supabase.from("evoluciones").select("*").order("created_at", { ascending: false });
      if (evoData) setEvoluciones(evoData);

      const localGastos = localStorage.getItem("anluvia_gastos");
      if (localGastos) setGastos(JSON.parse(localGastos));

      const localVentas = localStorage.getItem("anluvia_ventas");
      if (localVentas) setVentas(JSON.parse(localVentas));

      const localCampanas = localStorage.getItem("anluvia_campanas");
      if (localCampanas) setCampanas(JSON.parse(localCampanas));

      const localBlogs = localStorage.getItem("anluvia_blogs");
      if (localBlogs) setBlogs(JSON.parse(localBlogs));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CREAR O ACTUALIZAR USUARIO
  const handleCrearUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevaClave || rolesSeleccionados.length === 0) return;

    const nuevo: UsuarioEquipo = {
      id: Date.now().toString(),
      nombre: nuevoNombre,
      email: nuevoEmail || `${nuevoNombre.toLowerCase().replace(/\s+/g, '')}@anluvia.cl`,
      clave: nuevaClave,
      roles: rolesSeleccionados
    };

    const actualizados = [nuevo, ...usuarios];
    setUsuarios(actualizados);
    localStorage.setItem("anluvia_equipo_users", JSON.stringify(actualizados));

    setMensajeUsuario(`✅ Usuario "${nuevoNombre}" creado con éxito con ${rolesSeleccionados.length} rol(es).`);
    setNuevoNombre("");
    setNuevoEmail("");
    setNuevaClave("");
    setRolesSeleccionados(['especialista']);
  };

  const eliminarUsuario = (id: string) => {
    if (usuarios.length <= 1) {
      alert("Debe haber al menos un usuario administrador.");
      return;
    }
    const filtrados = usuarios.filter(u => u.id !== id);
    setUsuarios(filtrados);
    localStorage.setItem("anluvia_equipo_users", JSON.stringify(filtrados));
  };

  const toggleRolCheck = (rol: TipoRol) => {
    if (rolesSeleccionados.includes(rol)) {
      setRolesSeleccionados(rolesSeleccionados.filter(r => r !== rol));
    } else {
      setRolesSeleccionados([...rolesSeleccionados, rol]);
    }
  };

  const hasRole = (rol: TipoRol) => currentUser?.roles.includes(rol) || false;

  const seleccionarParaFicha = (pacienteEmail: string, pacienteNombre: string) => {
    setSelectedPacienteEmail(pacienteEmail);
    setSelectedPacienteNombre(pacienteNombre);
    setActiveTab("fichas");
    const evolucionesPaciente = evoluciones.filter((e) => e.paciente_email === pacienteEmail);
    setNumSesion(evolucionesPaciente.length + 1);
  };

  const emitirBoletaPrueba = async () => {
    setLoadingSii(true);
    setResultadoSii(null);
    const res = await emitirBoletaSII({
      pacienteNombre: "Valentina Silva",
      pacienteEmail: "paciente@anluvia.cl",
      montoTotal: 45000,
      glosaServicio: "Kinesiología & Recuperación Física - ANLUVIA",
      exento: true,
    });
    if (res.success) {
      const nuevaVenta = { id: Date.now().toString(), tipo: "Boleta Exenta", folio: res.folio, cliente: "Valentina Silva", email: "paciente@anluvia.cl", monto: 45000, fecha: new Date().toISOString().split("T")[0], estado: "Emitida SII" };
      const actualizadas = [nuevaVenta, ...ventas];
      setVentas(actualizadas);
      localStorage.setItem("anluvia_ventas", JSON.stringify(actualizadas));
    }
    setResultadoSii(res);
    setLoadingSii(false);
  };

  const emitirFacturaPrueba = async () => {
    setLoadingSii(true);
    setResultadoSii(null);
    const res = await emitirFacturaSII({
      rutEmpresa: "76.987.654-3",
      razonSocial: "Inversiones & Salud SpA",
      giro: "Servicios Médicos Corporativos",
      direccion: "Av. Apoquindo #4500, Of 802",
      comuna: "Las Condes",
      email: "finanzas@empresa.cl",
      montoNeto: 100000,
      glosaServicio: "Convenio Kinesiología Preventiva ANLUVIA",
      exento: true,
    });
    if (res.success) {
      const nuevaVenta = { id: Date.now().toString(), tipo: "Factura Exenta", folio: res.folio, cliente: "Inversiones & Salud SpA (76.987.654-3)", email: "finanzas@empresa.cl", monto: 100000, fecha: new Date().toISOString().split("T")[0], estado: "Emitida SII" };
      const actualizadas = [nuevaVenta, ...ventas];
      setVentas(actualizadas);
      localStorage.setItem("anluvia_ventas", JSON.stringify(actualizadas));
    }
    setResultadoSii(res);
    setLoadingSii(false);
  };

  const guardarEvolucion = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoEvolucion(true);
    try {
      const { error } = await supabase.from("evoluciones").insert([{ paciente_email: selectedPacienteEmail, paciente_nombre: selectedPacienteNombre, especialista: currentUser?.nombre || "Especialista ANLUVIA", numero_sesion: numSesion, eva_dolor: evaDolor, subjetivo, objetivo, tratamiento, indicaciones }]);
      if (error) setMensajeFicha("⚠️ " + error.message);
      else {
        setMensajeFicha("🎉 ¡Evolución registrada correctamente!");
        setSubjetivo(""); setObjetivo(""); setTratamiento(""); setIndicaciones("");
        cargarDatos();
      }
    } catch (err: any) { setMensajeFicha("⚠️ Error al guardar."); }
    finally { setGuardandoEvolucion(false); }
  };

  const guardarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gastoConcepto || !gastoMonto) return;
    setGuardandoGasto(true);
    const nuevoGasto = { id: Date.now().toString(), concepto: gastoConcepto, categoria: gastoCategoria, monto: Number(gastoMonto), fecha: gastoFecha, created_at: new Date().toISOString() };
    const nuevosGastos = [nuevoGasto, ...gastos];
    setGastos(nuevosGastos);
    localStorage.setItem("anluvia_gastos", JSON.stringify(nuevosGastos));
    setMensajeGasto("✅ Compra registrada."); setGastoConcepto(""); setGastoMonto(""); setGuardandoGasto(false);
  };

  const guardarCampana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campNombre || !campInversion) return;
    setGuardandoCampana(true);
    const nuevaCamp = { id: Date.now().toString(), nombre: campNombre, plataforma: campPlataforma, inversion: Number(campInversion), clics: Number(campClics || 0), citas: Number(campCitas || 0), fecha: new Date().toISOString().split("T")[0] };
    const actualizadas = [nuevaCamp, ...campanas];
    setCampanas(actualizadas);
    localStorage.setItem("anluvia_campanas", JSON.stringify(actualizadas));
    setMensajeCampana("✅ Campaña registrada."); setCampNombre(""); setCampInversion(""); setGuardandoCampana(false);
  };

  const guardarBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitulo || !blogContenido) return;
    const nuevoBlog = { id: Date.now().toString(), titulo: blogTitulo, categoria: blogCategoria, resumen: blogContenido.substring(0, 100) + "...", fecha: new Date().toISOString().split("T")[0] };
    const actualizados = [nuevoBlog, ...blogs];
    setBlogs(actualizados);
    localStorage.setItem("anluvia_blogs", JSON.stringify(actualizados));
    setMensajeBlog("✅ Artículo de Blog publicado."); setBlogTitulo(""); setBlogContenido("");
  };

  const exportarPDF = () => { if (!selectedPacienteEmail) return alert("Selecciona un paciente primero."); window.print(); };

  // CÁLCULOS FINANCIEROS
  const totalCitas = reservas.length;
  const pacientesUnicos = Array.from(new Set(reservas.map((r) => r.paciente_email))).map((email) => {
    const reserva = reservas.find((r) => r.paciente_email === email);
    return { email, nombre: reserva?.paciente_nombre || "Paciente ANLUVIA" };
  });

  const ingresosBrutos = reservas.reduce((acc, r) => acc + (preciosServicios[r.servicio] || 45000), 0);
  const egresosTotales = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  const gananciaNeta = ingresosBrutos - egresosTotales;
  const margenRentabilidad = ingresosBrutos > 0 ? Math.round((gananciaNeta / ingresosBrutos) * 100) : 0;

  const totalInversionAds = campanas.reduce((acc, c) => acc + Number(c.inversion || 0), 0);
  const totalCitasAds = campanas.reduce((acc, c) => acc + Number(c.citas || 0), 0);
  const costoPorCitaCPA = totalCitasAds > 0 ? Math.round(totalInversionAds / totalCitasAds) : 0;
  const roasMarketing = totalInversionAds > 0 ? ((totalCitasAds * 48000) / totalInversionAds).toFixed(1) : "0.0";

  const evolucionesPacienteActual = evoluciones.filter((e) => e.paciente_email === selectedPacienteEmail);

  // --- LOGIN ---
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: "#FBF9F6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ backgroundColor: "#FFFFFF", padding: "3rem", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.06)", border: "1px solid #F4EEE8", width: "100%", maxWidth: "440px", textAlign: "center" }}>
          <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "serif", letterSpacing: "0.05em", color: "#1F1F1F" }}>ANLUVIA</span>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem", marginBottom: "2rem" }}>
            GESTIÓN DE EQUIPO & ACCESO
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {loginError && (
              <div style={{ padding: "0.75rem", backgroundColor: "#FDF2F2", color: "#D93025", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600 }}>
                {loginError}
              </div>
            )}

            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem" }}>
                Ingresa tu Clave de Colaborador:
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid #ccc", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                required
              />
            </div>

            <button type="submit" style={{ backgroundColor: "#8B2434", color: "#FFFFFF", padding: "0.9rem", borderRadius: "9999px", border: "none", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
              Ingresar al Panel →
            </button>
          </form>

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #F4EEE8", fontSize: "0.75rem", color: "#666", textAlign: "left", lineHeight: "1.6" }}>
            🔐 <strong>Claves iniciales por perfil:</strong><br />
            • Admin Director: <code>anluvia2026</code><br />
            • Especialista Kinesiología: <code>kine2026</code><br />
            • Recepción / Caja: <code>recepcion2026</code><br />
            • Editor Web: <code>editor2026</code>
          </div>
        </div>
      </div>
    );
  }

  // --- PANEL SEGÚN ROLES COMBINADOS ---
  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "sans-serif", minHeight: "100vh", display: "flex" }}>
      
      {/* Sidebar Personalizada */}
      <aside className="no-print" style={{ width: "260px", borderRight: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight 700, letterSpacing: "0.05em", fontFamily: "serif" }}>ANLUVIA</span>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem" }}>
              ROLES: {currentUser?.roles.join(" + ").toUpperCase()}
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {/* OPCIONES DE ADMIN */}
            {hasRole('admin') && (
              <>
                <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'dashboard' ? 700 : 500, backgroundColor: activeTab === 'dashboard' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('dashboard')}>
                  📊 Dashboard & Métricas
                </div>
                <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'equipo' ? 700 : 500, backgroundColor: activeTab === 'equipo' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('equipo')}>
                  👥 Gestión de Equipo & Roles
                </div>
                <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'marketing' ? 700 : 500, backgroundColor: activeTab === 'marketing' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('marketing')}>
                  📣 Marketing & ROI Ads
                </div>
                <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'compras' ? 700 : 500, backgroundColor: activeTab === 'compras' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('compras')}>
                  📉 Compras & Gastos
                </div>
              </>
            )}

            {/* OPCIONES DE RECEPCION O ADMIN */}
            {(hasRole('admin') || hasRole('recepcion')) && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'ventas' ? 700 : 500, backgroundColor: activeTab === 'ventas' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('ventas')}>
                🧾 Caja & Facturación SII
              </div>
            )}

            {/* OPCIONES DE ESPECIALISTA O ADMIN */}
            {(hasRole('admin') || hasRole('especialista')) && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'fichas' ? 700 : 500, backgroundColor: activeTab === 'fichas' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('fichas')}>
                🩺 Fichas Kinésicas (SOAP)
              </div>
            )}

            {/* OPCIONES DE EDITOR O ADMIN */}
            {(hasRole('admin') || hasRole('editor')) && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'contenido' ? 700 : 500, backgroundColor: activeTab === 'contenido' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('contenido')}>
                ✍️ Contenido & Blog (CMS)
              </div>
            )}

            {/* AGENDA GENERAL (TODOS) */}
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'agenda' ? 700 : 500, backgroundColor: activeTab === 'agenda' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('agenda')}>
              📅 Agenda & Citas ({reservas.length})
            </div>
          </nav>
        </div>

        <div style={{ borderTop: "1px solid #F4EEE8", paddingTop: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{currentUser?.nombre}</div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>{currentUser?.email}</div>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#8B2434", fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, marginTop: "0.5rem", padding: 0 }}>
            🔒 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Trabajo */}
      <main style={{ flex: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>

        {/* DASHBOARD (ADMIN) */}
        {activeTab === 'dashboard' && hasRole('admin') && (
          <div className="no-print">
            <h1 style={{ fontSize: "2.25rem", margin: "0 0 2rem 0", fontFamily: "serif" }}>Indicadores de Negocio</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Ventas Brutas</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.3rem" }}>${ingresosBrutos.toLocaleString('es-CL')} CLP</div>
              </div>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", textTransform: "uppercase" }}>Gastos</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#8B2434", marginTop: "0.3rem" }}>${egresosTotales.toLocaleString('es-CL')} CLP</div>
              </div>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight 700, color: "#137333", textTransform: "uppercase" }}>Ganancia Neta</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: gananciaNeta >= 0 ? "#137333" : "#D93025", marginTop: "0.3rem" }}>${gananciaNeta.toLocaleString('es-CL')} CLP</div>
              </div>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Margen</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.3rem" }}>{margenRentabilidad}%</div>
              </div>
            </div>
          </div>
        )}

        {/* NUEVA PESTAÑA: GESTIÓN DE EQUIPO & ROLES (SOLO ADMIN) */}
        {activeTab === 'equipo' && hasRole('admin') && (
          <div className="no-print">
            <h1 style={{ fontSize: "2.25rem", margin: "0 0 2rem 0", fontFamily: "serif" }}>Gestión de Equipo & Roles de Acceso</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
              {/* Formulario Crear / Asignar Usuario */}
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#8B2434", fontFamily: "serif" }}>+ Agregar Nuevo Integrante</h3>

                {mensajeUsuario && (
                  <div style={{ padding: "0.75rem", backgroundColor: "#F4EEE8", borderRadius: "10px", color: "#7D8E7C", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {mensajeUsuario}
                  </div>
                )}

                <form onSubmit={handleCrearUsuario} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Nombre Completo *</label>
                    <input type="text" placeholder="Ej. Dra. Camila Morales" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight 600, color: "#666", marginBottom: "0.3rem" }}>Correo Electrónico</label>
                    <input type="email" placeholder="camila@anluvia.cl" value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Clave Privada de Acceso *</label>
                    <input type="text" placeholder="Ej. camila2026" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.5rem" }}>Asignar Rol(es) Permitidos *</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", backgroundColor: "#FBF9F6", padding: "0.85rem", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('especialista')} onChange={() => toggleRolCheck('especialista')} />
                        🩺 Kinesiología / Especialista (Fichas SOAP)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('recepcion')} onChange={() => toggleRolCheck('recepcion')} />
                        📋 Recepción & Caja (Facturación SII / Agenda)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('editor')} onChange={() => toggleRolCheck('editor')} />
                        ✍️ Editor Web / Marketing (Blog CMS)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#8B2434", fontWeight: 700 }}>
                        <input type="checkbox" checked={rolesSeleccionados.includes('admin')} onChange={() => toggleRolCheck('admin')} />
                        👑 Director / Admin (Acceso Total Finanzas)
                      </label>
                    </div>
                  </div>

                  <button type="submit" style={{ width: "100%", backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.85rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" }}>
                    👤 Guardar Nuevo Integrante
                  </button>
                </form>
              </div>

              {/* Tabla de Usuarios Activos */}
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#1F1F1F", marginBottom: "1.5rem", fontFamily: "serif" }}>
                  Personal del Equipo & Credenciales ({usuarios.length})
                </h3>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F4EEE8" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Clave</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Roles Asignados</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #F4EEE8" }}>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ fontWeight: 700 }}>{u.nombre}</div>
                          <div style={{ fontSize: "0.75rem", color: "#666" }}>{u.email}</div>
                        </td>
                        <td style={{ padding: "0.75rem" }}><code style={{ backgroundColor: "#F4EEE8", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>{u.clave}</code></td>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                            {u.roles.map(r => (
                              <span key={r} style={{ backgroundColor: r === 'admin' ? '#FDF2F2' : '#E6F4EA', color: r === 'admin' ? '#8B2434' : '#137333', padding: "0.15rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => eliminarUsuario(u.id)} style={{ background: "none", border: "none", color: "#D93025", cursor: "pointer", fontWeight: 600 }}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FICHAS MÉDICAS (ESPECIALISTA Y ADMIN) */}
        {activeTab === 'fichas' && (hasRole('admin') || hasRole('especialista')) && (
          <div>
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h1 style={{ fontSize: "2.25rem", margin: 0, fontFamily: "serif" }}>Ficha Médica & Evolución SOAP</h1>
              <button onClick={exportarPDF} disabled={!selectedPacienteEmail} style={{ backgroundColor: "#8B2434", color: "#FFF", padding: "0.75rem 1.5rem", borderRadius: "9999px", border: "none", fontWeight: 700, cursor: "pointer", opacity: !selectedPacienteEmail ? 0.5 : 1 }}>
                📄 Descargar Ficha PDF
              </button>
            </div>

            <div className="no-print" style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "1.5rem", marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.5rem" }}>Seleccionar Paciente Atendido:</label>
              <select value={selectedPacienteEmail} onChange={(e) => {
                const email = e.target.value;
                const p = pacientesUnicos.find((item) => item.email === email);
                if (p) seleccionarParaFicha(p.email, p.nombre);
              }} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }}>
                <option value="">-- Selecciona un Paciente --</option>
                {pacientesUnicos.map((p) => (
                  <option key={p.email} value={p.email}>{p.nombre} ({p.email})</option>
                ))}
              </select>
            </div>

            {selectedPacienteEmail ? (
              <div className="no-print" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                  <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#8B2434", fontFamily: "serif" }}>+ Registrar Nueva Evolución (Sesión #{numSesion})</h3>
                  {mensajeFicha && <div style={{ padding: "0.75rem", backgroundColor: "#F4EEE8", borderRadius: "10px", color: "#7D8E7C", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem" }}>{mensajeFicha}</div>}
                  <form onSubmit={guardarEvolucion} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>Dolor EVA: <strong>{evaDolor}/10</strong></label>
                      <input type="range" min="0" max="10" value={evaDolor} onChange={(e) => setEvaDolor(Number(e.target.value))} style={{ width: "100%", accentColor: "#8B2434" }} />
                    </div>
                    <div><label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>S (Subjetivo):</label><textarea value={subjetivo} onChange={(e) => setSubjetivo(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
                    <div><label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>O (Objetivo):</label><textarea value={objetivo} onChange={(e) => setObjetivo(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
                    <div><label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>A/P (Tratamiento):</label><textarea value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
                    <div><label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>Indicaciones:</label><textarea value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
                    <button type="submit" disabled={guardandoEvolucion} style={{ backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.85rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer" }}>Guardar Evolución Kinésica</button>
                  </form>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                  <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#7D8E7C", fontFamily: "serif" }}>Historial: {selectedPacienteNombre}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "450px", overflowY: "auto" }}>
                    {evolucionesPacienteActual.map((evo) => (
                      <div key={evo.id} style={{ border: "1px solid #F4EEE8", borderRadius: "12px", padding: "1rem", backgroundColor: "#FBF9F6" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, color: "#8B2434" }}>Sesión #{evo.numero_sesion}</span><span>EVA: {evo.eva_dolor}/10</span></div>
                        <div style={{ fontSize: "0.85rem", color: "#4A4A4A", marginTop: "0.3rem" }}>{evo.tratamiento}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: "#666", textAlign: "center", padding: "3rem" }}>Selecciona un paciente del menú superior.</p>
            )}
          </div>
        )}

        {/* AGENDA GENERAL (TODOS) */}
        {activeTab === 'agenda' && (
          <div className="no-print">
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
        )}

      </main>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { emitirBoletaSII, emitirFacturaSII } from "../../lib/sii";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reservas, setReservas] = useState<any[]>([]);
  const [evoluciones, setEvoluciones] = useState<any[]>([]);
  const [gastos, setGastos] = useState<any[]>([]);
  const [ventas, setVentas] = useState<any[]>([]);
  const [campanas, setCampanas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados SII / Ventas
  const [loadingSii, setLoadingSii] = useState(false);
  const [resultadoSii, setResultadoSii] = useState<any>(null);

  // Formulario de Evolución Kinésica
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState("");
  const [selectedPacienteNombre, setSelectedPacienteNombre] = useState("");
  const [especialista, setEspecialista] = useState("Dr. Matías Arancibia");
  const [numSesion, setNumSesion] = useState(1);
  const [evaDolor, setEvaDolor] = useState(5);
  const [subjetivo, setSubjetivo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [guardandoEvolucion, setGuardandoEvolucion] = useState(false);
  const [mensajeFicha, setMensajeFicha] = useState("");

  // Formulario de Gastos / Compras
  const [gastoConcepto, setGastoConcepto] = useState("");
  const [gastoCategoria, setGastoCategoria] = useState("Insumos Médicos");
  const [gastoMonto, setGastoMonto] = useState("");
  const [gastoFecha, setGastoFecha] = useState(new Date().toISOString().split("T")[0]);
  const [guardandoGasto, setGuardandoGasto] = useState(false);
  const [mensajeGasto, setMensajeGasto] = useState("");

  // Formulario de Marketing / Campañas
  const [campNombre, setCampNombre] = useState("");
  const [campPlataforma, setCampPlataforma] = useState("Meta Ads (Instagram/FB)");
  const [campInversion, setCampInversion] = useState("");
  const [campClics, setCampClics] = useState("");
  const [campCitas, setCampCitas] = useState("");
  const [guardandoCampana, setGuardandoCampana] = useState(false);
  const [mensajeCampana, setMensajeCampana] = useState("");

  const preciosServicios: { [key: string]: number } = {
    'Kinesiología & Recuperación Física': 45000,
    'Estética Facial Premium & Armonización': 55000,
    'Remodelación Corporal & Drenaje': 50000,
    'Masoterapia & Bienestar Integral': 40000,
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
      if (localCampanas) {
        setCampanas(JSON.parse(localCampanas));
      } else {
        const muestraCampanas = [
          { id: "1", nombre: "Campaña Estética Facial Invierno", plataforma: "Meta Ads (Instagram/FB)", inversion: 150000, clics: 850, citas: 12, fecha: "2026-07-01" },
          { id: "2", nombre: "Búsqueda Google Kinesiología Las Condes", plataforma: "Google Ads", inversion: 120000, clics: 420, citas: 9, fecha: "2026-07-05" },
          { id: "3", nombre: "Viral TikTok Remodelación Corporal", plataforma: "TikTok Ads", inversion: 80000, clics: 1200, citas: 6, fecha: "2026-07-10" },
        ];
        setCampanas(muestraCampanas);
        localStorage.setItem("anluvia_campanas", JSON.stringify(muestraCampanas));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      const nuevaVenta = {
        id: Date.now().toString(),
        tipo: "Boleta Exenta",
        folio: res.folio,
        cliente: "Valentina Silva",
        email: "paciente@anluvia.cl",
        monto: 45000,
        fecha: new Date().toISOString().split("T")[0],
        estado: "Emitida SII",
      };
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
      const nuevaVenta = {
        id: Date.now().toString(),
        tipo: "Factura Exenta",
        folio: res.folio,
        cliente: "Inversiones & Salud SpA (76.987.654-3)",
        email: "finanzas@empresa.cl",
        monto: 100000,
        fecha: new Date().toISOString().split("T")[0],
        estado: "Emitida SII",
      };
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
    setMensajeFicha("");

    try {
      const { error } = await supabase.from("evoluciones").insert([
        {
          paciente_email: selectedPacienteEmail,
          paciente_nombre: selectedPacienteNombre,
          especialista,
          numero_sesion: numSesion,
          eva_dolor: evaDolor,
          subjetivo,
          objetivo,
          tratamiento,
          indicaciones,
        },
      ]);

      if (error) {
        setMensajeFicha("⚠️ " + error.message);
      } else {
        setMensajeFicha("🎉 ¡Evolución registrada en la Ficha Médica!");
        setSubjetivo("");
        setObjetivo("");
        setTratamiento("");
        setIndicaciones("");
        cargarDatos();
      }
    } catch (err: any) {
      console.error(err);
      setMensajeFicha("⚠️ Error al guardar.");
    } finally {
      setGuardandoEvolucion(false);
    }
  };

  const guardarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gastoConcepto || !gastoMonto) return;

    setGuardandoGasto(true);

    const nuevoGasto = {
      id: Date.now().toString(),
      concepto: gastoConcepto,
      categoria: gastoCategoria,
      monto: Number(gastoMonto),
      fecha: gastoFecha,
      created_at: new Date().toISOString(),
    };

    const nuevosGastos = [nuevoGasto, ...gastos];
    setGastos(nuevosGastos);
    localStorage.setItem("anluvia_gastos", JSON.stringify(nuevosGastos));

    setMensajeGasto("✅ Gasto/Compra registrada correctamente.");
    setGastoConcepto("");
    setGastoMonto("");
    setGuardandoGasto(false);
  };

  const eliminarGasto = (id: string) => {
    const gastosFiltrados = gastos.filter((g) => g.id !== id);
    setGastos(gastosFiltrados);
    localStorage.setItem("anluvia_gastos", JSON.stringify(gastosFiltrados));
  };

  const guardarCampana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campNombre || !campInversion) return;

    setGuardandoCampana(true);

    const nuevaCamp = {
      id: Date.now().toString(),
      nombre: campNombre,
      plataforma: campPlataforma,
      inversion: Number(campInversion),
      clics: Number(campClics || 0),
      citas: Number(campCitas || 0),
      fecha: new Date().toISOString().split("T")[0],
    };

    const actualizadas = [nuevaCamp, ...campanas];
    setCampanas(actualizadas);
    localStorage.setItem("anluvia_campanas", JSON.stringify(actualizadas));

    setMensajeCampana("✅ Campaña registrada con éxito.");
    setCampNombre("");
    setCampInversion("");
    setCampClics("");
    setCampCitas("");
    setGuardandoCampana(false);
  };

  const eliminarCampana = (id: string) => {
    const filtradas = campanas.filter((c) => c.id !== id);
    setCampanas(filtradas);
    localStorage.setItem("anluvia_campanas", JSON.stringify(filtradas));
  };

  const exportarPDF = () => {
    if (!selectedPacienteEmail) {
      alert("Por favor selecciona un paciente primero.");
      return;
    }
    window.print();
  };

  // CÁLCULOS
  const totalCitas = reservas.length;
  const pacientesUnicos = Array.from(new Set(reservas.map((r) => r.paciente_email))).map((email) => {
    const reserva = reservas.find((r) => r.paciente_email === email);
    return { email, nombre: reserva?.paciente_nombre || "Paciente ANLUVIA" };
  });

  const ingresosBrutos = reservas.reduce((acc, r) => {
    const precio = preciosServicios[r.servicio] || 45000;
    return acc + precio;
  }, 0);

  const egresosTotales = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  const gananciaNeta = ingresosBrutos - egresosTotales;
  const margenRentabilidad = ingresosBrutos > 0 ? Math.round((gananciaNeta / ingresosBrutos) * 100) : 0;

  const totalInversionAds = campanas.reduce((acc, c) => acc + Number(c.inversion || 0), 0);
  const totalCitasAds = campanas.reduce((acc, c) => acc + Number(c.citas || 0), 0);
  const costoPorCitaCPA = totalCitasAds > 0 ? Math.round(totalInversionAds / totalCitasAds) : 0;
  const ingresosGeneradosAds = totalCitasAds * 48000;
  const roasMarketing = totalInversionAds > 0 ? (ingresosGeneradosAds / totalInversionAds).toFixed(1) : "0.0";

  const serviciosConteo: { [key: string]: number } = {};
  reservas.forEach((r) => {
    serviciosConteo[r.servicio] = (serviciosConteo[r.servicio] || 0) + 1;
  });

  const evolucionesPacienteActual = evoluciones.filter((e) => e.paciente_email === selectedPacienteEmail);

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "sans-serif", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar Lateral */}
      <aside className="no-print" style={{ width: "260px", borderRight: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "2.5rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "0.05em", fontFamily: "serif" }}>ANLUVIA</span>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem" }}>
              PANEL EJECUTIVO
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'dashboard' ? 700 : 500, backgroundColor: activeTab === 'dashboard' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('dashboard')}>
              📊 Dashboard & Métricas
            </div>
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'marketing' ? 700 : 500, backgroundColor: activeTab === 'marketing' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('marketing')}>
              📣 Marketing & ROI Ads
            </div>
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'ventas' ? 700 : 500, backgroundColor: activeTab === 'ventas' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('ventas')}>
              📈 Ventas & Facturación SII
            </div>
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'compras' ? 700 : 500, backgroundColor: activeTab === 'compras' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('compras')}>
              📉 Compras & Gastos
            </div>
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'agenda' ? 700 : 500, backgroundColor: activeTab === 'agenda' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('agenda')}>
              📅 Agenda & Citas ({reservas.length})
            </div>
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'fichas' ? 700 : 500, backgroundColor: activeTab === 'fichas' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('fichas')}>
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

        {/* PESTAÑA 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B2434", letterSpacing: "0.1em" }}>RESUMEN GENERAL</span>
                <h1 style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0", fontFamily: "serif" }}>Indicadores de Negocio</h1>
              </div>
              <button onClick={cargarDatos} style={{ backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.65rem 1.25rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer" }}>
                🔄 Actualizar Datos
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Ventas Brutas</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.3rem" }}>
                  ${ingresosBrutos.toLocaleString('es-CL')} <span style={{ fontSize: "0.8rem", color: "#666" }}>CLP</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", textTransform: "uppercase" }}>Compras & Gastos</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#8B2434", marginTop: "0.3rem" }}>
                  ${egresosTotales.toLocaleString('es-CL')} <span style={{ fontSize: "0.8rem", color: "#666" }}>CLP</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#137333", textTransform: "uppercase" }}>Ganancia Neta Real</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: gananciaNeta >= 0 ? "#137333" : "#D93025", marginTop: "0.3rem" }}>
                  ${gananciaNeta.toLocaleString('es-CL')} <span style={{ fontSize: "0.8rem", color: "#666" }}>CLP</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Margen Rentabilidad</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.3rem" }}>
                  {margenRentabilidad}%
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
              <h3 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#1F1F1F", fontFamily: "serif" }}>
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
                          <div style={{ width: `${porcentaje}%`, backgroundColor: "#7D8E7C", height: "100%", borderRadius: "9999px" }}></div>
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

        {/* PESTAÑA 2: MARKETING */}
        {activeTab === 'marketing' && (
          <div className="no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B2434", letterSpacing: "0.1em" }}>ADQUISICIÓN DE PACIENTES & ADS</span>
                <h1 style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0", fontFamily: "serif" }}>Marketing & Rendimiento de Anuncios</h1>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", textTransform: "uppercase" }}>Inversión Total Ads</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1F1F1F", marginTop: "0.3rem" }}>
                  ${totalInversionAds.toLocaleString('es-CL')} <span style={{ fontSize: "0.8rem", color: "#666" }}>CLP</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7D8E7C", textTransform: "uppercase" }}>Citas Generadas</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#137333", marginTop: "0.3rem" }}>
                  {totalCitasAds} <span style={{ fontSize: "0.8rem", color: "#666" }}>pacientes</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", textTransform: "uppercase" }}>CPA (Costo por Cita)</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#8B2434", marginTop: "0.3rem" }}>
                  ${costoPorCitaCPA.toLocaleString('es-CL')} <span style={{ fontSize: "0.8rem", color: "#666" }}>CLP</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#137333", textTransform: "uppercase" }}>ROAS (Retorno Ads)</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#137333", marginTop: "0.3rem" }}>
                  {roasMarketing}x
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#8B2434", fontFamily: "serif" }}>
                  + Registrar Campaña de Anuncios
                </h3>

                {mensajeCampana && (
                  <div style={{ padding: "0.75rem", backgroundColor: "#F4EEE8", borderRadius: "10px", color: "#7D8E7C", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {mensajeCampana}
                  </div>
                )}

                <form onSubmit={guardarCampana} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Nombre de la Campaña *</label>
                    <input type="text" placeholder="Ej. Promo Limpieza Facial Instagram" value={campNombre} onChange={(e) => setCampNombre(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Plataforma de Ads *</label>
                    <select value={campPlataforma} onChange={(e) => setCampPlataforma(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }}>
                      <option value="Meta Ads (Instagram/FB)">Meta Ads (Instagram / Facebook)</option>
                      <option value="Google Ads">Google Ads (Búsqueda / Maps)</option>
                      <option value="TikTok Ads">TikTok Ads</option>
                      <option value="Influencers / Offline">Influencers / Alianzas</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Inversión en Ads ($ CLP) *</label>
                    <input type="number" placeholder="Ej. 100000" value={campInversion} onChange={(e) => setCampInversion(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Clics</label>
                      <input type="number" placeholder="Ej. 500" value={campClics} onChange={(e) => setCampClics(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Citas</label>
                      <input type="number" placeholder="Ej. 8" value={campCitas} onChange={(e) => setCampCitas(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} />
                    </div>
                  </div>

                  <button type="submit" disabled={guardandoCampana} style={{ width: "100%", backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.85rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" }}>
                    {guardandoCampana ? "Guardando..." : "📣 Guardar Campaña"}
                  </button>
                </form>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#1F1F1F", marginBottom: "1.5rem", fontFamily: "serif" }}>
                  Campañas Activas ({campanas.length})
                </h3>

                {campanas.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F4EEE8" }}>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Campaña</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Inversión ($)</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Citas</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>CPA</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>ROAS</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campanas.map((c) => {
                        const cpaInd = c.citas > 0 ? Math.round(c.inversion / c.citas) : 0;
                        const roasInd = c.inversion > 0 ? ((c.citas * 48000) / c.inversion).toFixed(1) : "0.0";

                        return (
                          <tr key={c.id} style={{ borderBottom: "1px solid #F4EEE8" }}>
                            <td style={{ padding: "0.75rem" }}>
                              <div style={{ fontWeight: 700 }}>{c.nombre}</div>
                              <div style={{ fontSize: "0.75rem", color: "#8B2434" }}>{c.plataforma}</div>
                            </td>
                            <td style={{ padding: "0.75rem" }}>${Number(c.inversion).toLocaleString('es-CL')}</td>
                            <td style={{ padding: "0.75rem", color: "#137333", fontWeight: 700 }}>{c.citas}</td>
                            <td style={{ padding: "0.75rem" }}>${cpaInd.toLocaleString('es-CL')}</td>
                            <td style={{ padding: "0.75rem" }}><span style={{ backgroundColor: "#E6F4EA", color: "#137333", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontWeight: 700 }}>{roasInd}x</span></td>
                            <td style={{ padding: "0.75rem" }}>
                              <button onClick={() => eliminarCampana(c.id)} style={{ background: "none", border: "none", color: "#D93025", cursor: "pointer" }}>🗑️</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "#666", textAlign: "center", padding: "2rem 0" }}>Aún no has registrado campañas.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: VENTAS */}
        {activeTab === 'ventas' && (
          <div className="no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B2434", letterSpacing: "0.1em" }}>INGRESOS & DOCUMENTOS TRIBUTARIOS</span>
                <h1 style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0", fontFamily: "serif" }}>Ventas & Facturación SII</h1>
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "2px solid #8B2434", padding: "2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B2434", letterSpacing: "0.1em", textTransform: "uppercase" }}>MODO SIMULACIÓN / SANDBOX EN VIVO</span>
                  <h3 style={{ fontSize: "1.4rem", margin: "0.2rem 0 0 0", fontFamily: "serif" }}>🧾 Emisión Rápida de Boleta / Factura SII</h3>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button onClick={emitirBoletaPrueba} disabled={loadingSii} style={{ backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.65rem 1.25rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer" }}>
                    {loadingSii ? "Procesando..." : "🧾 Emitir Boleta Exenta"}
                  </button>
                  <button onClick={emitirFacturaPrueba} disabled={loadingSii} style={{ backgroundColor: "#8B2434", color: "#FFF", padding: "0.65rem 1.25rem", borderRadius: "9999px", border: "none", fontWeight: 700, cursor: "pointer" }}>
                    {loadingSii ? "Procesando..." : "📑 Emitir Factura Exenta"}
                  </button>
                </div>
              </div>

              {resultadoSii && (
                <div style={{ backgroundColor: "#F4EEE8", borderRadius: "12px", padding: "1.25rem", marginTop: "1.25rem", borderLeft: "4px solid #7D8E7C" }}>
                  <div style={{ fontWeight: 700, color: "#1F1F1F", marginBottom: "0.5rem" }}>
                    🎉 Respuesta de la API Tributaria (Modo: {resultadoSii.modo?.toUpperCase()})
                  </div>
                  <pre style={{ fontSize: "0.85rem", color: "#333", backgroundColor: "#FFF", padding: "1rem", borderRadius: "8px", overflowX: "auto", margin: 0 }}>
                    {JSON.stringify(resultadoSii, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#1F1F1F", marginBottom: "1.5rem", fontFamily: "serif" }}>
                Historial de Boletas y Facturas Emitidas ({ventas.length})
              </h3>

              {ventas.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F4EEE8" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Fecha</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Tipo</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Folio</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Cliente</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Monto</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((v) => (
                      <tr key={v.id} style={{ borderBottom: "1px solid #F4EEE8" }}>
                        <td style={{ padding: "0.75rem" }}>{v.fecha}</td>
                        <td style={{ padding: "0.75rem" }}><strong>{v.tipo}</strong></td>
                        <td style={{ padding: "0.75rem", color: "#8B2434", fontWeight: 700 }}>#{v.folio}</td>
                        <td style={{ padding: "0.75rem" }}>{v.cliente}</td>
                        <td style={{ padding: "0.75rem", color: "#137333", fontWeight: 700 }}>${v.monto.toLocaleString('es-CL')} CLP</td>
                        <td style={{ padding: "0.75rem" }}><span style={{ backgroundColor: "#E6F4EA", color: "#137333", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>{v.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "#666", textAlign: "center", padding: "2rem 0" }}>Aún no has registrado ventas.</p>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: COMPRAS */}
        {activeTab === 'compras' && (
          <div className="no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B2434", letterSpacing: "0.1em" }}>EGRESOS & FACTURAS DE PROVEEDORES</span>
                <h1 style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0", fontFamily: "serif" }}>Compras & Gastos Operativos</h1>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#8B2434", fontFamily: "serif" }}>
                  + Registrar Nueva Compra / Gasto
                </h3>

                {mensajeGasto && (
                  <div style={{ padding: "0.75rem", backgroundColor: "#F4EEE8", borderRadius: "10px", color: "#7D8E7C", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {mensajeGasto}
                  </div>
                )}

                <form onSubmit={guardarGasto} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Concepto / Proveedor *</label>
                    <input type="text" placeholder="Ej. Factura N° 4512 - Insumos Médicos..." value={gastoConcepto} onChange={(e) => setGastoConcepto(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Categoría *</label>
                    <select value={gastoCategoria} onChange={(e) => setGastoCategoria(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }}>
                      <option value="Insumos Médicos">Insumos Médicos & Estética</option>
                      <option value="Arriendo & Servicios">Arriendo & Servicios Básicos</option>
                      <option value="Sueldos & Honorarios">Sueldos & Honorarios</option>
                      <option value="Marketing & Publicidad">Marketing & Publicidad</option>
                      <option value="Equipamiento">Equipamiento & Mantenimiento</option>
                      <option value="Otros">Otros Gastos Operativos</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Monto Total ($ CLP) *</label>
                    <input type="number" placeholder="Ej. 120000" value={gastoMonto} onChange={(e) => setGastoMonto(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Fecha *</label>
                    <input type="date" value={gastoFecha} onChange={(e) => setGastoFecha(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }} required />
                  </div>

                  <button type="submit" disabled={guardandoGasto} style={{ width: "100%", backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.85rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" }}>
                    {guardandoGasto ? "Guardando..." : "💵 Guardar Compra"}
                  </button>
                </form>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.3rem", margin: 0, color: "#1F1F1F", fontFamily: "serif" }}>
                    Historial de Compras ({gastos.length})
                  </h3>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#8B2434" }}>
                    Total: ${egresosTotales.toLocaleString('es-CL')} CLP
                  </div>
                </div>

                {gastos.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F4EEE8" }}>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Fecha</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Concepto</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Categoría</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Monto</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastos.map((g) => (
                        <tr key={g.id} style={{ borderBottom: "1px solid #F4EEE8" }}>
                          <td style={{ padding: "0.75rem" }}>{g.fecha}</td>
                          <td style={{ padding: "0.75rem" }}><strong>{g.concepto}</strong></td>
                          <td style={{ padding: "0.75rem" }}><span style={{ backgroundColor: "#F4EEE8", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.75rem" }}>{g.categoria}</span></td>
                          <td style={{ padding: "0.75rem", color: "#8B2434", fontWeight: 700 }}>${Number(g.monto).toLocaleString('es-CL')}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <button onClick={() => eliminarGasto(g.id)} style={{ background: "none", border: "none", color: "#D93025", cursor: "pointer" }}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "#666", textAlign: "center", padding: "2rem 0" }}>Aún no has registrado compras.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 5: AGENDA */}
        {activeTab === 'agenda' && (
          <div className="no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7D8E7C", letterSpacing: "0.1em" }}>OPERACIONES EN VIVO</span>
                <h1 style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0", fontFamily: "serif" }}>Agenda de Atención</h1>
              </div>
              <button onClick={cargarDatos} style={{ backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.65rem 1.25rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer" }}>🔄 Actualizar</button>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
              {loading ? (
                <p>Cargando reservas...</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F4EEE8" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Fecha & Hora</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Paciente</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Tratamiento</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Especialista</th>
                      <th style={{ padding: "0.75rem", textAlign: "left" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid #F4EEE8" }}>
                        <td style={{ padding: "0.75rem" }}><strong>{r.fecha}</strong> ({r.hora} hrs)</td>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ fontWeight: 600 }}>{r.paciente_nombre}</div>
                          <div style={{ fontSize: "0.8rem", color: "#666" }}>{r.paciente_email}</div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>{r.servicio}</td>
                        <td style={{ padding: "0.75rem" }}>{r.especialista}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <button onClick={() => seleccionarParaFicha(r.paciente_email, r.paciente_nombre)} style={{ backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.4rem 0.85rem", borderRadius: "9999px", border: "none", fontSize: "0.75rem", cursor: "pointer" }}>
                            🩺 Abrir Ficha →
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

        {/* PESTAÑA 6: FICHAS */}
        {activeTab === 'fichas' && (
          <div>
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B2434", letterSpacing: "0.1em" }}>REGISTRO CLÍNICO OFICIAL</span>
                <h1 style={{ fontSize: "2.25rem", margin: "0.25rem 0 0 0", fontFamily: "serif" }}>Ficha Médica & Evolución SOAP</h1>
              </div>

              <button onClick={exportarPDF} disabled={!selectedPacienteEmail} style={{ backgroundColor: "#8B2434", color: "#FFF", padding: "0.75rem 1.5rem", borderRadius: "9999px", border: "none", fontWeight: 700, cursor: "pointer", opacity: !selectedPacienteEmail ? 0.5 : 1 }}>
                📄 Descargar Ficha en PDF
              </button>
            </div>

            <div className="no-print" style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "1.5rem", marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#666", marginBottom: "0.5rem" }}>
                Seleccionar Paciente para la Sesión:
              </label>
              <select value={selectedPacienteEmail} onChange={(e) => {
                const email = e.target.value;
                const p = pacientesUnicos.find((item) => item.email === email);
                if (p) seleccionarParaFicha(p.email, p.nombre);
              }} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc" }}>
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
                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                    <h3 style={{ fontSize: "1.3rem", marginTop: 0, color: "#8B2434", fontFamily: "serif" }}>
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
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Subjetivo:</label>
                        <textarea placeholder="Ej. Refiere disminución del dolor articular..." value={subjetivo} onChange={(e) => setSubjetivo(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc", minHeight: "80px" }} />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Objetivo:</label>
                        <textarea placeholder="Ej. Rango de flexión recuperado a 110°..." value={objetivo} onChange={(e) => setObjetivo(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc", minHeight: "80px" }} />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Tratamiento:</label>
                        <textarea placeholder="Ej. Terapia manual, ultrasonido..." value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc", minHeight: "80px" }} />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#666", marginBottom: "0.3rem" }}>Indicaciones:</label>
                        <textarea placeholder="Ej. Ejercicios de movilidad 2 veces al día..." value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #ccc", minHeight: "80px" }} />
                      </div>

                      <button type="submit" disabled={guardandoEvolucion} style={{ width: "100%", backgroundColor: "#7D8E7C", color: "#FFF", padding: "0.85rem", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer" }}>
                        {guardandoEvolucion ? "Guardando..." : "💾 Guardar Evolución"}
                      </button>
                    </form>
                  </div>

                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <h3 style={{ fontSize: "1.3rem", margin: 0, color: "#7D8E7C", fontFamily: "serif" }}>
                        Historial: {selectedPacienteNombre}
                      </h3>
                      <button onClick={exportarPDF} style={{ backgroundColor: "#8B2434", color: "#FFF", padding: "0.4rem 0.85rem", borderRadius: "9999px", border: "none", fontSize: "0.75rem", cursor: "pointer" }}>
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

                {/* PDF IMPRESIÓN */}
                <div id="area-pdf-oficial" style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "2px solid #7D8E7C", padding: "3rem", marginTop: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #8B2434", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
                    <div>
                      <h1 style={{ fontSize: "2rem", margin: 0, color: "#1F1F1F", letterSpacing: "0.05em", fontFamily: "serif" }}>ANLUVIA</h1>
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

                  <h3 style={{ fontSize: "1.25rem", color: "#8B2434", marginBottom: "1rem", fontFamily: "serif" }}>
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
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>Documento generado electrónicamente por ANLUVIA Ecosistema Clínico.</div>
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
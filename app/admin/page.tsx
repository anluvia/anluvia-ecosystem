'use client';

import React, { useEffect, useState } from "react";
import { UsuarioEquipo, TipoRol } from "./types";
import LoginCard from "./components/LoginCard";
import DashboardTab from "./components/DashboardTab";
import EquipoTab from "./components/EquipoTab";
import VentasTab from "./components/VentasTab";
import ComprasTab from "./components/ComprasTab";
import FichasTab from "./components/FichasTab";
import AgendaTab from "./components/AgendaTab";
import PersonalizacionTab from "./components/PersonalizacionTab";

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
  const [activeTab, setActiveTab] = useState("personalizacion");
  const [usuarios, setUsuarios] = useState<UsuarioEquipo[]>(usuariosBaseIniciales);

  useEffect(() => {
    const localUsers = localStorage.getItem("anluvia_equipo_users");
    if (localUsers) {
      try { setUsuarios(JSON.parse(localUsers)); } catch {}
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const userFound = usuarios.find((u) => u.clave === inputPassword.trim());
    if (userFound) {
      setIsAuthenticated(true);
      setCurrentUser(userFound);
    } else {
      setLoginError("🔑 Clave no reconocida. Verifica tus credenciales.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const hasRole = (rol: TipoRol): boolean => {
    return Boolean(currentUser?.roles?.includes(rol));
  };

  if (!isAuthenticated) {
    return (
      <LoginCard
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        handleLogin={handleLogin}
        loginError={loginError}
      />
    );
  }

  const renderTabContent = () => {
    if (activeTab === 'dashboard' && hasRole('admin')) return <DashboardTab />;
    if (activeTab === 'equipo' && hasRole('admin')) return <EquipoTab />;
    if (activeTab === 'ventas' && (hasRole('admin') || hasRole('recepcion'))) return <VentasTab />;
    if (activeTab === 'compras' && hasRole('admin')) return <ComprasTab />;
    if (activeTab === 'fichas' && (hasRole('admin') || hasRole('especialista'))) return <FichasTab />;
    if (activeTab === 'agenda') return <AgendaTab />;
    if (activeTab === 'personalizacion' && (hasRole('admin') || hasRole('editor'))) return <PersonalizacionTab />;
    return <PersonalizacionTab />;
  };

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "sans-serif", minHeight: "100vh", display: "flex" }}>
      <aside style={{ width: "260px", borderRight: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <img src="/logo.png" alt="ANLUVIA" style={{ maxHeight: "55px", marginBottom: "0.5rem", objectFit: "contain" }} />
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700 }}>
              {currentUser?.nombre}
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {hasRole('admin') && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'dashboard' ? 700 : 500, backgroundColor: activeTab === 'dashboard' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('dashboard')}>
                📊 Dashboard
              </div>
            )}
            {hasRole('admin') && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'equipo' ? 700 : 500, backgroundColor: activeTab === 'equipo' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('equipo')}>
                👥 Gestión Equipo
              </div>
            )}
            {(hasRole('admin') || hasRole('editor')) && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'personalizacion' ? 700 : 500, backgroundColor: activeTab === 'personalizacion' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('personalizacion')}>
                🎨 Personalización Web
              </div>
            )}
            {(hasRole('admin') || hasRole('recepcion')) && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'ventas' ? 700 : 500, backgroundColor: activeTab === 'ventas' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('ventas')}>
                📈 Ventas & SII
              </div>
            )}
            {(hasRole('admin') || hasRole('especialista')) && (
              <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'fichas' ? 700 : 500, backgroundColor: activeTab === 'fichas' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('fichas')}>
                🩺 Fichas Kinésicas
              </div>
            )}
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: activeTab === 'agenda' ? 700 : 500, backgroundColor: activeTab === 'agenda' ? '#F4EEE8' : 'transparent' }} onClick={() => setActiveTab('agenda')}>
              📅 Agenda & Citas
            </div>
          </nav>
        </div>
        <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#8B2434", fontSize: "0.8rem", cursor: "pointer", fontWeight: 700 }}>
          🔒 Cerrar Sesión
        </button>
      </aside>

      <main style={{ flex: 1, padding: "2.5rem 3rem", overflowY: "auto" }}>
        {renderTabContent()}
      </main>
    </div>
  );
}
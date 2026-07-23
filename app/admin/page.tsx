'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { UsuarioEquipo, TipoRol } from "./types";
import LoginCard from "./components/LoginCard";

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

  return (
    <div style={{ backgroundColor: "#FBF9F6", color: "#1F1F1F", fontFamily: "sans-serif", minHeight: "100vh", display: "flex" }}>
      <aside style={{ width: "260px", borderRight: "1px solid #F4EEE8", backgroundColor: "#FFFFFF", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "serif" }}>ANLUVIA</span>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B2434", fontWeight: 700, marginTop: "0.2rem" }}>
              {currentUser?.nombre}
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", cursor: "pointer", fontWeight: 700, backgroundColor: "#F4EEE8" }}>
              📊 Dashboard
            </div>
          </nav>
        </div>
        <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#8B2434", fontSize: "0.8rem", cursor: "pointer", fontWeight: 700 }}>
          🔒 Cerrar Sesión
        </button>
      </aside>

      <main style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <h1 style={{ fontSize: "2.25rem", margin: "0 0 1.5rem 0", fontFamily: "serif" }}>Panel de Control ANLUVIA</h1>
        <p>Bienvenido/a, <strong>{currentUser?.nombre}</strong>. Módulo cargado en arquitectura modular limpia.</p>
      </main>
    </div>
  );
}
'use client';

import React from 'react';
import { WHATSAPP_CLINICA_NUMERO } from '@/lib/whatsapp';

export default function WhatsAppWidget() {
  const mensajeDefault = encodeURIComponent("¡Hola ANLUVIA Clinique! ✨ Quisiera consultar por información y disponibilidad de tratamientos.");
  const urlWhatsApp = `https://wa.me/${WHATSAPP_CLINICA_NUMERO}?text=${mensajeDefault}`;

  return (
    <aside
      className="no-print"
      aria-label="Contacto y Redes Sociales"
      style={{
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        pointerEvents: 'auto'
      }}
    >
      {/* Redes Sociales */}
      <div style={{ display: 'flex', gap: '10px', backgroundColor: '#FFFFFF', padding: '8px 14px', borderRadius: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #E2E8F0' }}>
        <a href="https://instagram.com/anluvia.cl" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ textDecoration: 'none', fontSize: '1.2rem' }}>📸</a>
        <a href="https://facebook.com/anluvia.cl" target="_blank" rel="noopener noreferrer" title="Facebook" style={{ textDecoration: 'none', fontSize: '1.2rem' }}>📘</a>
        <a href="https://tiktok.com/@anluvia.cl" target="_blank" rel="noopener noreferrer" title="TikTok" style={{ textDecoration: 'none', fontSize: '1.2rem' }}>🎵</a>
      </div>

      {/* Botón WhatsApp */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          borderRadius: '50px',
          padding: '12px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.5)',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.92rem',
          fontFamily: 'sans-serif',
          border: '2px solid #FFFFFF'
        }}
      >
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>💬</span>
        <span>¿Dudas? Escríbenos</span>
      </a>
    </aside>
  );
}
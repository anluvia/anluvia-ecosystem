'use client';

import React from 'react';
import { WHATSAPP_CLINICA_NUMERO } from '../lib/whatsapp';

export default function WhatsAppWidget() {
  const mensajeDefault = encodeURIComponent("¡Hola ANLUVIA Clinique! ✨ Quisiera consultar por información y disponibilidad de tratamientos.");
  const urlWhatsApp = `https://wa.me/${WHATSAPP_CLINICA_NUMERO}?text=${mensajeDefault}`;

  const redesSociales = [
    { nombre: 'Instagram', url: 'https://instagram.com/anluvia.cl', icono: '📸' },
    { nombre: 'Facebook', url: 'https://facebook.com/anluvia.cl', icono: '📘' },
    { nombre: 'TikTok', url: 'https://tiktok.com/@anluvia.cl', icono: '🎵' },
  ];

  return (
    <aside className="no-print" aria-label="Contacto y Redes Sociales" style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
      
      {/* Barra de Redes Sociales Secundarias */}
      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '6px 12px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', backdropFilter: 'blur(5px)', border: '1px solid #E2E8F0' }}>
        {redesSociales.map((red) => (
          <a
            key={red.nombre}
            href={red.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Síguenos en ${red.nombre}`}
            style={{ textDecoration: 'none', fontSize: '1.1rem', transition: 'transform 0.2s ease', display: 'inline-block' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {red.icono}
          </a>
        ))}
      </div>

      {/* Botón Principal Flotante de WhatsApp */}
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
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.92rem',
          fontFamily: 'Inter, sans-serif',
          transition: 'all 0.3s ease',
          border: '2px solid #FFFFFF'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.45)';
        }}
      >
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>💬</span>
        <span>¿Dudas? Escríbenos</span>
      </a>

    </aside>
  );
}
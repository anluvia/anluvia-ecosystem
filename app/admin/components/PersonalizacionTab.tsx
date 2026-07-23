'use client';

import React, { useState } from 'react';

export default function PersonalizacionTab() {
  const [heroBgUrl, setHeroBgUrl] = useState('');
  const [tituloHero, setHeroTitulo] = useState('Recupera tu vitalidad y potencia tu belleza natural');
  const [subtituloHero, setHeroSubtitulo] = useState('En ANLUVIA combinamos la precisión de la kinesiología médica con las últimas tendencias en estética avanzada.');
  const [telefono, setTelefono] = useState('+56 9 1234 5678');
  const [direccion, setDireccion] = useState('Av. Las Condes #12345, Santiago, Chile');
  const [mensaje, setMensaje] = useState('');

  const handleGuardarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaConfig = {
      logoUrl: '/logo.png',
      heroBgUrl,
      tituloHero,
      subtituloHero,
      telefono,
      direccion,
    };
    localStorage.setItem('anluvia_site_config', JSON.stringify(nuevaConfig));
    setMensaje('🎉 ¡Configuración guardada exitosamente!');
    setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B2434', letterSpacing: '0.1em' }}>SITIO WEB & BRANDING</span>
        <h1 style={{ fontSize: '2.25rem', margin: '0.25rem 0 0 0', fontFamily: 'serif' }}>Personalización Visual & Marca</h1>
      </div>

      {mensaje ? (
        <div style={{ padding: '1rem', backgroundColor: '#E6F4EA', color: '#137333', borderRadius: '12px', fontWeight: 600, marginBottom: '1.5rem' }}>
          {mensaje}
        </div>
      ) : null}

      <form onSubmit={handleGuardarConfig} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.3rem', margin: 0, color: '#8B2434', fontFamily: 'serif' }}>🖼️ Logo Oficial & Multimedia</h3>

          <div style={{ padding: '1rem', backgroundColor: '#FBF9F6', borderRadius: '12px', textAlign: 'center', border: '1px solid #F4EEE8' }}>
            <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>LOGO OFICIAL ANLUVIA:</span>
            <img src="/logo.png" alt="ANLUVIA Logo Oficial" style={{ maxHeight: '90px', objectFit: 'contain' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>
              URL de Imagen de Fondo (Hero Banner)
            </label>
            <input
              type="url"
              placeholder="https://ejemplo.com/foto-clinica.jpg"
              value={heroBgUrl}
              onChange={(e) => setHeroBgUrl(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ccc', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.3rem', margin: 0, color: '#7D8E7C', fontFamily: 'serif' }}>📝 Textos Principales & Contacto</h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>Título Principal Portada</label>
            <input
              type="text"
              value={tituloHero}
              onChange={(e) => setHeroTitulo(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ccc', fontSize: '0.9rem' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>Subtítulo Principal</label>
            <textarea
              value={subtituloHero}
              onChange={(e) => setHeroSubtitulo(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ccc', fontSize: '0.9rem', minHeight: '80px' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ccc', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>Dirección Sucursal</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ccc', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '1rem',
              backgroundColor: '#8B2434',
              color: '#FFFFFF',
              padding: '0.9rem',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            💾 Guardar Cambios de Diseño
          </button>
        </div>
      </form>
    </div>
  );
}
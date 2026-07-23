export interface BoletaDatos {
  pacienteNombre: string;
  pacienteEmail: string;
  pacienteRut?: string;
  montoTotal: number;
  glosaServicio: string;
  exento?: boolean;
}

export interface FacturaDatos {
  rutEmpresa: string;
  razonSocial: string;
  giro: string;
  direccion: string;
  comuna: string;
  email: string;
  montoNeto: number;
  glosaServicio: string;
  exento?: boolean; // true = TipoDTE 34 (Exenta), false = TipoDTE 33 (Afecta 19% IVA)
}

export async function emitirBoletaSII(datos: BoletaDatos) {
  try {
    const response = await fetch('/api/sii/boleta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function emitirFacturaSII(datos: FacturaDatos) {
  try {
    const response = await fetch('/api/sii/factura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
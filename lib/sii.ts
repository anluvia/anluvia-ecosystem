export interface BoletaDatos {
  pacienteNombre: string;
  pacienteEmail: string;
  pacienteRut?: string;
  montoTotal: number;
  glosaServicio: string;
  exento?: boolean;
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
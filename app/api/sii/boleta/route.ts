import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pacienteNombre, pacienteEmail, pacienteRut, montoTotal, glosaServicio, exento = true } = body;

    const apiKey = process.env.OPENFACTURA_API_KEY || process.env.HAULMER_API_KEY;

    // Modo Sandbox / Simulación si aún no hay API Key configurada
    if (!apiKey) {
      const folioSimulado = Math.floor(1000 + Math.random() * 9000);
      return NextResponse.json({
        success: true,
        modo: 'sandbox',
        mensaje: 'Boleta emitida en modo simulación (Configura OPENFACTURA_API_KEY en Vercel para producción).',
        folio: folioSimulado,
        monto: montoTotal,
        rutEmisor: process.env.EMISOR_RUT || '77.123.456-7',
        fechaEmision: new Date().toISOString().split('T')[0]
      });
    }

    // Estructura DTE Oficial de Chile (Tipo 41: Boleta Exenta / Tipo 39: Boleta Afecta)
    const payloadDTE = {
      response: ["PDF", "FOLIO"],
      dte: {
        Encabezado: {
          IdDoc: {
            TipoDTE: exento ? 41 : 39,
            Folio: 0
          },
          Emisor: {
            RUTEmisor: process.env.EMISOR_RUT || "77123456-7"
          },
          Receptor: {
            RUTRecep: pacienteRut || "66666666-6",
            RznSocRecep: pacienteNombre || "Paciente General",
            Contacto: pacienteEmail
          },
          Totales: {
            MntTotal: montoTotal
          }
        },
        Detalle: [
          {
            NmbItem: glosaServicio || "Atención Médica ANLUVIA",
            QtyItem: 1,
            PrcItem: montoTotal,
            MntItem: montoTotal
          }
        ]
      }
    };

    const apiRes = await fetch('https://api.haulmer.com/v2/dte/issue', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadDTE)
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      throw new Error(data.message || 'Error al comunicarse con la API DTE');
    }

    return NextResponse.json({
      success: true,
      modo: 'produccion',
      folio: data.folio,
      pdfUrl: data.pdf,
      data
    });

  } catch (error: any) {
    console.error('Error emitiendo boleta:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al procesar el documento tributario' },
      { status: 500 }
    );
  }
}
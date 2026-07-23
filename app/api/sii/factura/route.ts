import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rutEmpresa, razonSocial, giro, direccion, comuna, email, montoNeto, glosaServicio, exento = true } = body;

    const apiKey = process.env.OPENFACTURA_API_KEY || process.env.HAULMER_API_KEY;

    // Calculo de IVA si es afecta (TipoDTE 33)
    const iva = exento ? 0 : Math.round(montoNeto * 0.19);
    const montoTotal = montoNeto + iva;

    // Modo Sandbox / Simulación si aún no hay API Key
    if (!apiKey) {
      const folioSimulado = Math.floor(5000 + Math.random() * 4000);
      return NextResponse.json({
        success: true,
        modo: 'sandbox',
        mensaje: 'Factura emitida en modo simulación (Configura OPENFACTURA_API_KEY en Vercel para producción).',
        tipoDTE: exento ? 34 : 33,
        tipoDocumento: exento ? 'Factura Electrónica Exenta' : 'Factura Electrónica Afecta',
        folio: folioSimulado,
        receptor: {
          rut: rutEmpresa,
          razonSocial,
          giro
        },
        montoNeto,
        iva,
        montoTotal,
        fechaEmision: new Date().toISOString().split('T')[0]
      });
    }

    // Estructura DTE Oficial de Chile para Facturas (Tipo 33 / 34)
    const payloadDTE = {
      response: ["PDF", "FOLIO"],
      dte: {
        Encabezado: {
          IdDoc: {
            TipoDTE: exento ? 34 : 33,
            Folio: 0
          },
          Emisor: {
            RUTEmisor: process.env.EMISOR_RUT || "77123456-7"
          },
          Receptor: {
            RUTRecep: rutEmpresa,
            RznSocRecep: razonSocial,
            GiroRecep: giro,
            DirRecep: direccion,
            CmnaRecep: comuna,
            Contacto: email
          },
          Totales: {
            MntNeto: montoNeto,
            MntExento: exento ? montoNeto : 0,
            IVA: iva,
            MntTotal: montoTotal
          }
        },
        Detalle: [
          {
            NmbItem: glosaServicio || "Servicios Médicos y Clínicos ANLUVIA",
            QtyItem: 1,
            PrcItem: montoNeto,
            MntItem: montoNeto
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
      throw new Error(data.message || 'Error al comunicarse con la API DTE del SII');
    }

    return NextResponse.json({
      success: true,
      modo: 'produccion',
      folio: data.folio,
      pdfUrl: data.pdf,
      data
    });

  } catch (error: any) {
    console.error('Error emitiendo factura:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al emitir Factura Electrónica' },
      { status: 500 }
    );
  }
}
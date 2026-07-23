import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: body.id || 'reserva-anluvia',
            title: body.title || 'Reserva de Cita - ANLUVIA Clinique',
            quantity: 1,
            unit_price: Number(body.price || 45000),
            currency_id: 'CLP',
          }
        ],
        back_urls: {
          success: `${req.nextUrl.origin}/portal?status=success`,
          failure: `${req.nextUrl.origin}/portal?status=failure`,
          pending: `${req.nextUrl.origin}/portal?status=pending`,
        },
        auto_return: 'approved',
      }
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error('Error creando preferencia MP:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar el pago' }, { status: 500 });
  }
}
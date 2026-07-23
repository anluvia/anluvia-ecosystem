import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_P8findiS_CYFhvSFApyotKYGqjDRgiKeE');

export async function POST(req: NextRequest) {
  try {
    const { pacienteNombre, pacienteEmail, servicio, especialista, fecha, hora } = await req.json();

    if (!pacienteEmail) {
      return NextResponse.json({ error: 'Falta correo del paciente' }, { status: 400 });
    }

    // 1. Plantilla de Confirmación para el Paciente
    const htmlPaciente = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FBF9F6; padding: 40px 20px; color: #1F1F1F;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; padding: 40px; border: 1px solid #A7B7A5;">
          <div style="text-align: center; border-bottom: 1px solid #F4EEE8; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-family: Georgia, serif; font-size: 28px; margin: 0; color: #1F1F1F; letter-spacing: 2px;">ANLUVIA</h1>
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #8B2434; font-weight: bold; margin-top: 5px;">Clinique & Wellness</p>
          </div>

          <h2 style="font-family: Georgia, serif; font-size: 22px; color: #7D8E7C; margin-top: 0;">¡Hola ${pacienteNombre}! ✨</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #555555;">
            Tu cita ha sido <strong>confirmada exitosamente</strong>. A continuación te detallamos los datos de tu atención:
          </p>

          <div style="background-color: #F4EEE8; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Tratamiento:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1F1F1F; text-align: right;">${servicio}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Especialista:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1F1F1F; text-align: right;">${especialista}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Fecha & Hora:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #8B2434; text-align: right;">${fecha} a las ${hora} hrs</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #666666; line-height: 1.5;">
            📍 <strong>Ubicación:</strong> Sede Las Condes — Av. Las Condes #12345, Oficina 602.<br>
            ⏳ Te recomendamos llegar 10 minutos antes de tu hora agendada.
          </p>

          <div style="text-align: center; margin-top: 35px; padding-top: 25px; border-top: 1px solid #F4EEE8;">
            <a href="https://anluvia-ecosystem.vercel.app/portal" style="background-color: #7D8E7C; color: #FFFFFF; text-decoration: none; padding: 12px 30px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
              Acceder a mi Portal
            </a>
          </div>
        </div>
      </div>
    `;

    // 2. Plantilla de Notificación Interna para ANLUVIA (contacto@anluvia.cl)
    const htmlClinica = `
      <div style="font-family: Arial, sans-serif; background-color: #F4EEE8; padding: 30px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; padding: 30px; border-left: 6px solid #8B2434;">
          <h2 style="color: #8B2434; margin-top: 0;">🚨 ¡Nueva Reserva Agendada!</h2>
          <p style="color: #333; font-size: 15px;">Se ha registrado una nueva cita desde la página web:</p>

          <div style="background-color: #FBF9F6; border: 1px solid #A7B7A5; border-radius: 10px; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>👤 Paciente:</strong> ${pacienteNombre}</p>
            <p style="margin: 5px 0;"><strong>✉️ Email Paciente:</strong> ${pacienteEmail}</p>
            <p style="margin: 5px 0;"><strong>🩺 Tratamiento:</strong> ${servicio}</p>
            <p style="margin: 5px 0;"><strong>👩‍⚕️ Especialista:</strong> ${especialista}</p>
            <p style="margin: 5px 0;"><strong>📅 Fecha & Hora:</strong> ${fecha} a las ${hora} hrs</p>
          </div>

          <p style="font-size: 13px; color: #666;">Puedes revisar y gestionar esta cita directamente en tu <a href="https://anluvia-ecosystem.vercel.app/admin" style="color: #7D8E7C; font-weight: bold;">Panel Administrativo</a>.</p>
        </div>
      </div>
    `;

    // Enviar correo al Paciente
    await resend.emails.send({
      from: 'ANLUVIA Clinique <contacto@anluvia.cl>',
      replyTo: 'contacto@anluvia.cl',
      to: [pacienteEmail],
      subject: `✨ Cita Confirmada: ${servicio} — ANLUVIA Clinique`,
      html: htmlPaciente,
    });

    // Enviar notificación interna a la clínica
    await resend.emails.send({
      from: 'ANLUVIA Sistema <contacto@anluvia.cl>',
      to: ['contacto@anluvia.cl'],
      subject: `🚨 [NUEVA CITA] ${pacienteNombre} - ${servicio} (${fecha} ${hora} hrs)`,
      html: htmlClinica,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al enviar correo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
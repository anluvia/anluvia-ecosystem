export const WHATSAPP_CLINICA_NUMERO = "56945524877";

export function crearWhatsAppLink(params: {
  telefono?: string;
  mensaje: string;
}) {
  const num = params.telefono ? params.telefono.replace(/\D/g, '') : WHATSAPP_CLINICA_NUMERO;
  const textEncoded = encodeURIComponent(params.mensaje);
  return `https://wa.me/${num}?text=${textEncoded}`;
}

export function crearMensajeReservaWhatsApp(data: {
  pacienteNombre: string;
  servicio: string;
  especialista: string;
  fecha: string;
  hora: string;
}) {
  const mensaje = `Hola ANLUVIA Clinique ✨, acabo de agendar una cita desde la web:\n\n` +
    `👤 *Paciente:* ${data.pacienteNombre}\n` +
    `🩺 *Tratamiento:* ${data.servicio}\n` +
    `👩‍⚕️ *Especialista:* ${data.especialista}\n` +
    `📅 *Fecha y Hora:* ${data.fecha} a las ${data.hora} hrs\n\n` +
    `¿Me podrían confirmar si requieren algún requisito previo para mi atención? ¡Gracias!`;

  return crearWhatsAppLink({ mensaje });
}
export function crearGoogleCalendarLink(params: {
  titulo: string;
  especialista: string;
  fecha: string; // Formato YYYY-MM-DD
  hora: string;  // Formato HH:MM
  duracionMinutos?: number;
  ubicacion?: string;
}) {
  const {
    titulo,
    especialista,
    fecha,
    hora,
    duracionMinutos = 60,
    ubicacion = 'ANLUVIA Clinique — Av. Las Condes #12345, Oficina 602, Santiago'
  } = params;

  if (!fecha || !hora) return '#';

  // Parsear fecha y hora para formato ISO
  const [year, month, day] = fecha.split('-');
  const [hours, minutes] = hora.split(':');

  const startDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  const endDate = new Date(startDate.getTime() + duracionMinutos * 60000);

  const formatIso = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatIso(startDate)}/${formatIso(endDate)}`;

  const details = encodeURIComponent(
    `Atención Médica ANLUVIA Clinique\n\n` +
    `• Tratamiento: ${titulo}\n` +
    `• Especialista: ${especialista}\n` +
    `• Ubicación: ${ubicacion}\n\n` +
    `Recuerda llegar 10 minutos antes. Para gestionar tu cita, ingresa a https://anluvia-ecosystem.vercel.app/portal`
  );

  const titleEncoded = encodeURIComponent(`✨ Cita ANLUVIA: ${titulo}`);
  const locationEncoded = encodeURIComponent(ubicacion);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&dates=${datesParam}&details=${details}&location=${locationEncoded}&ctz=America/Santiago`;
}
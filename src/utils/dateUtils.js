const MONTHS_ARRAY = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DAYS_ARRAY = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

function formatTimeBR(ms) {
  const date = new Date(ms);
  let str = '';
  if ((date.getUTCDate() - 1) > 0) str += `${(date.getUTCDate() - 1)} ${date.getUTCDate() - 1 == 1 ? 'dia ' : 'dias '}`;
  if (date.getUTCHours() > 0) str += `${(date.getUTCHours())} ${date.getUTCHours() == 1 ? 'hora ' : 'horas '}`;
  if (date.getUTCMinutes() > 0) str += `${(date.getUTCMinutes())} ${date.getUTCMinutes() == 1 ? 'minuto ' : 'minutos '}`;
  if (date.getUTCSeconds() > 0) str += `${(date.getUTCSeconds())} ${date.getUTCSeconds() == 1 ? 'segundo' : 'segundos'}`;
  if (ms == 0) return '1 segundo'; return str;
}
function formatTimer(ms) {
  const date = new Date(ms);
  return `${formatNumber(date.getUTCHours())}:${formatNumber(date.getUTCMinutes())}:${formatNumber(date.getUTCSeconds())}`;
}

function formatTime(date) {
  return `${formatNumber(date.hours)}:${formatNumber(date.minutes)}`;
}
function formatDate(date) {
  return `${date.day} de ${formatMonth(date)} de ${date.year}`;
}
function formatMonth(date) {
  return MONTHS_ARRAY[date.month];
}

function formatDayOfWeek(date) {
  return DAYS_ARRAY[date.day_of_week];
}

function formatDateBR(ms) {
  const date = destructorDate(ms);
  return `${formatDayOfWeek(date)}, ${formatDate(date)} às ${formatTime(date)}`;
}
function destructorDate(ms) {
  const date = new Date(ms);
  return {
    day: date.getDate(),
    day_of_week: date.getDay(),
    year: date.getFullYear(),
    month: date.getMonth(),
    minutes: date.getMinutes(),
    hours: date.getHours(),
    seconds: date.getSeconds(),
  };
}
function formatNumber(number) {
  return number < 10 ? `0${number}` : number;
}
module.exports = {
  formatTimeBR, formatTimer, formatTime, formatDate, formatMonth, formatDayOfWeek, formatDateBR, destructorDate, formatNumber,
};

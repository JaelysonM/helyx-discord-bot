const destructureDate = (time) => {
  const date = new Date(time);
  return {
    day: date.getDate(),
    day_of_week: date.getDay(),
    year: date.getFullYear(),
    month: date.getMonth(),
    minutes: date.getMinutes(),
    hours: date.getHours(),
    seconds: date.getSeconds()
  }
};

function timetoSec(ms) {
  var date = new Date(ms);
  var str = '';
  if (date.getUTCDate() - 1 == 0 && date.getUTCSeconds() == 0 && date.getUTCHours() == 0 && date.getUTCMinutes() == 0) {
    str = 'Nulo'
  }
  if (date.getUTCDate() - 1 > 0) {
    str += date.getUTCDate() - 1 + " " + ((date.getUTCDate() - 1) == 1 ? "dia " : "dias ");
  }
  if (date.getUTCHours() > 0) {
    str += date.getUTCHours() + " " + (date.getUTCHours() == 1 ? "hora " : "horas ");
  } if (date.getUTCMinutes() > 0) {
    str += date.getUTCMinutes() + " " + (date.getUTCMinutes() == 1 ? "minuto " : "minutos ");
  }
  if (date.getUTCSeconds() > 0) {
    str += date.getUTCSeconds() + " " + (date.getUTCSeconds() == 1 ? "segundo" : "segundos");
  }
  if (ms == 0) {
    return "1 segundo";
  }
  return str;
}


function formatCountdown(time) {
  const date = new Date(time);
  return `${formatNumber(date.getUTCHours())}:${formatNumber(date.getUTCMinutes())}:${formatNumber(date.getUTCSeconds())}`
}

const elementByIndex = (array, index) => array[index];

const formatNumber = (number) => number < 10 ? '0' + number : number;

const formatMonth = (date) => elementByIndex(['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'], date.month);

const formatDayOfWeek = (date) => elementByIndex(['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'], date.day_of_week);

const formatTime = (date) => `${formatNumber(date.hours)}:${formatNumber(date.minutes)}`

const formatDate = (date) => `${date.day} de ${formatMonth(date)} de ${date.year}`;

const toMillis = (seconds) => seconds * 1000;

const minutesToMillis = (minutes) => toMillis(60 * minutes);

const hoursToMillis = (hours) => minutesToMillis(60 * hours);

const daysToMillis = (days) => hoursToMillis(24 * days);

const composeDateBR = (timestamp) => {
  const date = destructureDate(timestamp);
  return `${formatDayOfWeek(date)}, ${formatDate(date)} às ${formatTime(date)}`
};


module.exports = { composeDateBR, toMillis, minutesToMillis, hoursToMillis, daysToMillis, formatCountdown, timetoSec };
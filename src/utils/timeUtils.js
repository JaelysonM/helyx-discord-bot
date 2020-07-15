function daysToMillis(days) {
  return hoursToMillis(24 * days)
}
function hoursToMillis(hours) {
  return minutesToMillis(60 * hours)
}
function minutesToMillis(minutes) {
  return toMillis(60 * minutes)
}
function toMillis(seconds) {
  return seconds * 1000
}

module.exports = {
  daysToMillis, hoursToMillis, minutesToMillis, toMillis
}
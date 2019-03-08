function expandToTwoDigits(item) {
  return item > 9 ? item : '0' + item
}

function dateToString(date) {
  // format dd.MM.yyyy HH.mm

  return (
    expandToTwoDigits(date.getDate()) +
    '.' +
    expandToTwoDigits(date.getMonth()) +
    '.' +
    date.getFullYear() +
    ' ' +
    expandToTwoDigits(date.getHours()) +
    ':' +
    expandToTwoDigits(date.getMinutes())
  )
}

function stringToDate(string) {
  // format dd.MM.yyyy HH.mm

  let [date, time] = string.split(' ')
  let [day, month, year] = date.split('.')
  let [hours, minutes] = time.split(':')

  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

module.exports.dateToString = dateToString
module.exports.stringToDate = stringToDate

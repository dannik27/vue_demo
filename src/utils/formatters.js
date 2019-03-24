function expandToTwoDigits(item) {
  return item > 9 ? item : '0' + item
}

export function dateToString(date) {
  // format dd.MM.yyyy HH.mm

  return (
    expandToTwoDigits(date.getDate()) +
    '.' +
    expandToTwoDigits(date.getMonth() + 1) +
    '.' +
    date.getFullYear() +
    ' ' +
    expandToTwoDigits(date.getHours()) +
    ':' +
    expandToTwoDigits(date.getMinutes())
  )
}

export function timestampToString(timestamp) {
  if (timestamp) {
    return dateToString(new Date(timestamp))
  } else {
    return undefined
  }
}

export function stringToDate(string) {
  // format dd.MM.yyyy HH.mm

  let [date, time] = string.split(' ')
  let [day, month, year] = date.split('.')
  let [hours, minutes] = time.split(':')

  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

export function shortPersonName(person) {
  if (person) {
    return (
      person.secondname +
      ' ' +
      person.firstname.split('')[0] +
      '. ' +
      person.thirdname.split('')[0] +
      '. '
    )
  } else {
    return 'not defined'
  }
}

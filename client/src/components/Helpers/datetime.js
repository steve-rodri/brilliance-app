import moment from 'moment'

function date(fields){
  if (fields) {
    if (fields.start && fields.end && moment(fields.end).isAfter(fields.start, 'day')) {
      return (
        `${moment(fields.start).format('MMMM Do')} - ${moment(fields.end).format('MMMM Do')}`
      )
    } else {
      return (
        moment(fields.start).format('MMMM Do')
      )
    }
  }
}

function time(fields){

  if (fields) {
    if (fields.start && fields.end && moment(fields.end).isSameOrAfter(fields.start, 'day')) {
      const startOfDay = moment(fields.start).startOf('day')
      if (moment(fields.start).isSame(startOfDay, 'minute') && moment(fields.end).isSame(startOfDay, 'minute')) {
        return (
          'All-Day'
        )
      }
    }
    return (
      `${moment(fields.start).format('LT')} - ${moment(fields.end).format('LT')}`
    )
  }
}

export {
  date,
  time
}

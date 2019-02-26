import moment from 'moment'

function date(fields){
  if (fields) {
    if (fields.start && fields.end ) {
      const startOfDay = moment(fields.start).startOf('day')
      const start = moment(fields.start)
      const end = moment(fields.end)

      if (start.diff(end, 'minutes') < 1440 && end.diff(startOfDay, 'minutes') <= 1440) {

        return (
          start.format('MMMM Do')
        )

      } else {
        if ( end.diff(startOfDay, 'minutes') % 1440 === 0 ) {
          return (
            `${start.format('MMMM Do')} - ${end.subtract(1,'day').format('MMMM Do')}`
          )
        } else {
          return (
            `${start.format('MMMM Do')} - ${end.format('MMMM Do')}`
          )
        }
      }
    }
  }
}

function time(fields){

  if (fields) {
    if (fields.start && fields.end && moment(fields.end).isSameOrAfter(fields.start, 'day')) {
      const startOfDay = moment(fields.start).startOf('day')
      if (
        moment(fields.start).isSame(startOfDay, 'minute') &&
        moment(fields.end).diff(moment(startOfDay), 'minutes') % 1440 === 0
      ) {
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

function start(item) {
  if (item) {
    if (item.start) {
      if (item.start.date) {
        return item.start.date
      } else if (item.start.dateTime) {
        return item.start.dateTime
      }
    }
  }
}

function end(item) {
  if (item) {
    if (item.end) {
      if (item.end.date) {
        return item.end.date
      } else if (item.end.dateTime) {
        return item.end.dateTime
      }
    }
  }
}

export {
  date,
  time,
  start,
  end
}

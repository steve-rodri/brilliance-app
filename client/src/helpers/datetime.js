import React from 'react'
import moment from 'moment'
import countdown from 'countdown'
countdown.setLabels(
' || m| hr |||||||',
' || m| hrs |||||||',
', '
)

function date(fields, short, days){
  if (!fields && !fields.start && !fields.end) return;

  const startOfDay = moment(fields.start).startOf('day')
  const start = moment(fields.start)
  const end = moment(fields.end)

  if (start.isBefore(moment(), 'year')) {

    if (start.diff(end, 'minutes') < 1440 && end.diff(startOfDay, 'minutes') <= 1440) {

      if (short) {
        if (days) {
          return (
            start.format('ddd, MMM Do YYYY')
          )
        } else {
          return (
            start.format('MMM Do YYYY')
          )
        }
      } else {
        if (days) {
          return (
            start.format('dddd, MMM Do YYYY')
          )
        } else {
          return (
            start.format('MMM Do YYYY')
          )
        }
      }

    } else {
      if ( end.diff(startOfDay, 'minutes') % 1440 === 0 ) {
        if (short) {
          if (days) {
            return (
              `${start.format('ddd MMM Do')} - ${end.subtract(1,'day').format('ddd MMM Do YYYY')}`
            )
          } else {
            return (
              `${start.format('MMM Do')} - ${end.subtract(1,'day').format('Do YYYY')}`
            )
          }
        } else {
          if (days) {
            return (
              `${start.format('ddd MMMM Do')} - ${end.subtract(1,'day').format('ddd MMMM Do YYYY')}`
            )
          } else {
            return (
              `${start.format('MMMM Do')} - ${end.subtract(1,'day').format('Do YYYY')}`
            )
          }
        }
      } else {
        if (short) {
          if (days) {
            return (
              `${start.format('ddd MMM Do')} - ${end.format('ddd MMM Do YYYY')}`
            )
          } else {
            return (
              `${start.format('MMM Do')} - ${end.format('Do YYYY')}`
            )
          }
        } else {
          if (days) {
            return (
              `${start.format('ddd MMMM Do')} - ${end.format('ddd MMMM Do YYYY')}`
            )
          } else {
            return (
              `${start.format('MMMM Do')} - ${end.format('Do YYYY')}`
            )
          }
        }
      }
    }

  } else {

    if (start.diff(end, 'minutes') < 1440 && end.diff(startOfDay, 'minutes') <= 1440) {

      if (short) {
        if (days) {
          return (
            start.format('ddd, MMM Do')
          )
        } else {
          return (
            start.format('MMM Do')
          )
        }
      } else {
        if (days) {
          return (
            start.format('dddd, MMM Do')
          )
        } else {
          return (
            start.format('MMM Do')
          )
        }
      }

    } else {
      if ( end.diff(startOfDay, 'minutes') % 1440 === 0 ) {
        if (short) {
          if (days) {
            return (
              `${start.format('ddd MMM Do')} - ${end.subtract(1,'day').format('ddd MMM Do')}`
            )
          } else {
            return (
              `${start.format('MMM Do')} - ${end.subtract(1,'day').format('Do')}`
            )
          }
        } else {
          if (days) {
            return (
              `${start.format('ddd MMMM Do')} - ${end.subtract(1,'day').format('ddd MMMM Do')}`
            )
          } else {
            return (
              `${start.format('MMMM Do')} - ${end.subtract(1,'day').format('Do')}`
            )
          }
        }
      } else {
        if (short) {
          if (days) {
            return (
              `${start.format('ddd MMM Do')} - ${end.format('ddd MMM Do')}`
            )
          } else {
            return (
              `${start.format('MMM Do')} - ${end.format('Do')}`
            )
          }
        } else {
          if (days) {
            return (
              `${start.format('ddd MMMM Do')} - ${end.format('ddd MMMM Do')}`
            )
          } else {
            return (
              `${start.format('MMMM Do')} - ${end.format('Do')}`
            )
          }
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
        return null
      } else {
        return (
          `${moment(fields.start).format('LT')} - ${moment(fields.end).format('LT')}`
        )
      }
    }
  }
}

function duration(start, end, unit){
  const time = countdown(start, end, countdown.HOURS|countdown.MINUTES, 2).toString();
  return time.split(',').map(str => str.replace(/\s/g,'')).join(' ')
}

function timeUntil(item){
  const now = moment();
  const eStart = moment(start(item));
  const eEnd = moment(end(item));
  const inProgress = now.isSameOrAfter(eStart) && now.isSameOrBefore(eEnd)
  const fromStart = countdown(eStart, now, countdown.HOURS|countdown.MINUTES, 2).toString();
  const fromEnd = countdown(now, eEnd, countdown.HOURS | countdown.MINUTES, 2).toString();

  function trim(duration){
    return duration.split(',').map(str => str.replace(/\s/g,'')).join(' ')
  }

  if ( inProgress ) {
    return (
      <div>
        <h4 style={{color: 'darkred'}}>IN PROGRESS</h4>
        <p style={{textAlign: 'left'}}>started <span style={{fontWeight:'bold'}}>{trim(fromStart)}</span> ago</p>
        <p style={{textAlign: 'left'}}>ends in <span style={{fontWeight:'bold'}}>{trim(fromEnd)}</span></p>
      </div>
    )
  } else {
    return moment(start(item)).fromNow()
  }
}

function start(item) {
  if (item) {
    if (item.start) {
      if (item.start.date) {
        return item.start.date
      } else if (item.start.dateTime) {
        return item.start.dateTime
      } else {
        return item.start
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
      } else {
        return item.end
      }
    }
  }
}

export {
  date,
  time,
  duration,
  timeUntil,
  start,
  end
}

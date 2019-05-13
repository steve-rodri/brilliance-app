import axios from 'axios'

export const event = {
  get: async function(id, options){
    const { cancelToken, unauthorizedCB, iCalUID } = options
    try {
      if (iCalUID) {
        const resp = await axios.get(`/api/events?i_cal_UID=${iCalUID}`)
        return resp.data.event
      } else {
        const resp = await axios.get(`/api/events/${id}`, { cancelToken: cancelToken })
        return resp.data.event
      }
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  batch: async function(params, options){
    const { sendCount, cancelToken, unauthorizedCB } = options

    const url = () => {
      let base = "/api/events?"
      if (params) {
        for (const prop in params) {
          if (params[prop]) {
            base += `${prop}=${params[prop]}&`
          }
        }
        const arr = base.split('')
        arr.pop()
        let url = arr.join('')

        if (sendCount) url += `&send_count=true`
        return url
      } else {
        if (sendCount) base += `send_count=true`
        return base
      }
    }

    try {
      const resp = await axios.get(url(), { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  create: async function(data, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/events`, data, { cancelToken: cancelToken })
      return resp.data.event
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  delete: async function (id, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.delete(`/api/events/${id}`, { cancelToken: cancelToken })
      return resp
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  update: async function(id, data, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.put(`/api/events/${id}`, data, { cancelToken: cancelToken })
      return resp.data.event
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  sync: async function(data, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.put('/api/events/sync', data, { cancelToken: cancelToken })
      return resp.data.event
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const client = {
  get: async function (id, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/clients/${id}`, { cancelToken: cancelToken })
      return resp.data.client
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  batch: async function(params, options){
    const { sendCount, cancelToken, unauthorizedCB } = options

    const url = () => {
      let base = "/api/clients?"
      if (params) {
        for (const prop in params) {
          if (params[prop]) {
            base += `${prop}=${params[prop]}&`
          }
        }
        const arr = base.split('')
        arr.pop()
        let url = arr.join('')

        if (sendCount) url += `&send_count=true`
        return url
      } else {
        if (sendCount) base += `send_count=true`
        return base
      }
    }

    try {
      const resp = await axios.get(url(), { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  create: async function (data, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/clients/`, data, { cancelToken: cancelToken })
      return resp.data.client
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  update: async function (id, data, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.put(`/api/clients/${id}`, data, { cancelToken: cancelToken })
      return resp.data.client
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  delete: async function (id, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.delete(`/api/clients/${id}`, { cancelToken: cancelToken })
      return resp
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const invoice = {
  get: async function(id, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/invoices/${id}`, { cancelToken: cancelToken })
      return resp.data.invoice
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  batch: async function(params, options){
    const { sendCount, cancelToken, unauthorizedCB } = options

    const url = () => {
      let base = "/api/invoices?"
      if (params) {
        for (const prop in params) {
          if (params[prop]) {
            base += `${prop}=${params[prop]}&`
          }
        }
        const arr = base.split('')
        arr.pop()
        let url = arr.join('')

        if (sendCount) url += `&send_count=true`
        return url
      } else {
        if (sendCount) base += `send_count=true`
        return base
      }
    }

    try {
      const resp = await axios.get(url(), { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  create: async function(data, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/invoices`, data, { cancelToken: cancelToken })
      return resp.data.invoice
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  update: async function(id, data, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.put(`/api/invoices/${id}`, data, { cancelToken: cancelToken })
      return resp.data.invoice
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  delete: async function(id, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.delete(`/api/invoices/${id}`, { cancelToken: cancelToken })
      return resp
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const line = {
  create: async function (data, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/lines`, data, { cancelToken: cancelToken })
      return resp.data.line
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Line Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  delete: async function (id, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.delete(`/api/lines/${id}`, { cancelToken: cancelToken })
      return resp
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Line Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const item = {
  find: async function (query, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/items?q=${query}`, { cancelToken: cancelToken })
      return resp.data.items
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Item Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const eventEmployee = {
  create: async function (data, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/event_employees`, data, { cancelToken: cancelToken })
      return resp.data.eventEmployee
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('EventEmployee Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  delete: async function (id, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.delete(`/api/event_employees/${id}`, { cancelToken: cancelToken })
      return resp.data.eventEmployee
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('EventEmployee Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const employee = {
  getAll: async function (page, options) {
    const { cancelToken, unauthorizedCB, sendCount } = options
    let url = `/api/employees?page=${page}`
    if (sendCount) url += '&send_count=true'
    try {
      const resp = await axios.get(url, { cancelToken: cancelToken })
      return resp.data.employees
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Employee Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  find: async function (query, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/employees?q=${query}`, { cancelToken: cancelToken })
      return resp.data.employee
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Employee Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  findByEmail: async function (email, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/employees?email='${email}'`, { cancelToken: cancelToken })
      return resp.data.employee
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Employee Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const place = {
  getAll: async function (options){
    const { cancelToken, unauthorizedCB, sendCount } = options
    let url = '/api/places'
    if (sendCount) url += '?send_count=true'
    try {
      const resp = await axios.get(url, { cancelToken: cancelToken })
      return resp.data.place
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Place Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  find: async function (query, options){
    const { cancelToken, unauthorizedCB, sendCount } = options
    let url = `/api/places/find?q=${query}`
    if (sendCount) url += '&send_count=true'
    try {
      const resp = await axios.get(url, { cancelToken: cancelToken })
      return resp.data.places
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Place Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const contact = {
  find: async function(query, options){
    const { cancelToken, unauthorizedCB, sendCount } = options
    let url = `/api/contacts/find?q=${query}`
    if (sendCount) url += '&send_count=true'
    try {
      const resp = await axios.get(url, { cancelToken: cancelToken })
      return resp.data.contacts
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Contact Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  },
  findByEmail: async function(email, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/contacts/find?email=${email}`, { cancelToken: cancelToken })
      return resp.data.contact
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Contact Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const company = {
  find: async function(query, options){
    const { cancelToken, unauthorizedCB, sendCount } = options
    let url = `/api/companies/find?q=${query}`
    if (sendCount) url +='&send_count=true'
    try {
      const resp = await axios.get(url, { cancelToken: cancelToken })
      return resp.data.company
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Company Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const emailAddress = {
  find: async function(query, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/email_addresses/find?q=${query}`, { cancelToken: cancelToken })
      return resp.data.emailAddress
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Email Address Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

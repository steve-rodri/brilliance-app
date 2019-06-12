import axios from 'axios'
import Qs from 'qs';

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
    const { sendCount: send_count, cancelToken, unauthorizedCB } = options

    try {
      const resp = await axios.get('/api/events', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken,
        onDownloadProgress: function (pe) {
          if (pe.lengthComputable) {
            console.log(pe.loaded, pe.total)
          }
        }
      })
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
      const resp = await axios.put('/api/events/sync', data, {
        cancelToken: cancelToken,
        onDownloadProgress: function (pe) {
          if (pe.lengthComputable) {
            console.log(pe.loaded, pe.total)
          }
        }
      })
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
    const { sendCount: send_count, cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get('/api/clients', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken
      })
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
    const { sendCount: send_count, cancelToken, unauthorizedCB } = options

    try {
      const resp = await axios.get('/api/invoices', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken
      })
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
  find: async function (query, options) {
    const { cancelToken, unauthorizedCB, clientId } = options
    const url = () => {
      let base = "/api/lines?"
      base += `q=${query}`
      if (clientId) base += `&client_id=${clientId}`
      return base
    }

    try {
      const resp = await axios.get( url(), { cancelToken: cancelToken })
      return resp.data.lines
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Item Request Canceled')
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
    const { cancelToken, unauthorizedCB, clientId } = options
    const url = () => {
      let base = "/api/items?"
      base += `q=${query}`
      if (clientId) base += `&client_id=${clientId}`
      return base
    }

    try {
      const resp = await axios.get( url(), { cancelToken: cancelToken })
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
  },
  create: async function (data, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/items`, data, { cancelToken: cancelToken })
      return resp.data.item
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

export const inventory = {
  find: async function (query, options){
    const { cancelToken, unauthorizedCB } = options
    const url = () => {
      let base = "/api/inventories?"
      base += `q=${query}`
      return base
    }

    try {
      const resp = await axios.get( url(), { cancelToken: cancelToken })
      return resp.data.inventories
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
  get: async function (params, options) {
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get(`/api/employees?`, {
        params: params,
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken
      })
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
  batch: async function(params, options){
    const { sendCount: send_count, cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.get('/api/employees', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken,
        onDownloadProgress: function (pe) {
          if (pe.lengthComputable) {
            console.log(pe.loaded, pe.total)
          }
        }
      })
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
  },
  create: async function(data, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/places`, data, { cancelToken: cancelToken })
      return resp.data.place
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

export const address = {
  batch: async function(params, options){
    const { sendCount: send_count, cancelToken, unauthorizedCB } = options

    try {
      const resp = await axios.get('/api/addresses', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken,
        onDownloadProgress: function (pe) {
          if (pe.lengthComputable) {
            console.log(pe.loaded, pe.total)
          }
        }
      })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Address Request Canceled')
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
      const resp = await axios.post(`/api/addresses`, data, { cancelToken: cancelToken })
      return resp.data.address
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Address Request Canceled')
      }
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
  }
}

export const contact = {
  find: async function(params, options){
    const { cancelToken, unauthorizedCB, sendCount: send_count } = options

    try {
      const resp = await axios.get('/api/contacts', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken
      })
      return resp.data
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
  create: async function(data, options){
    const { cancelToken, unauthorizedCB } = options
    try {
      const resp = await axios.post(`/api/contacts`, data, { cancelToken: cancelToken })
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
  find: async function(params, options){
    const { cancelToken, unauthorizedCB, sendCount: send_count } = options
    try {
      const resp = await axios.get('/api/companies', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken
      })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Company Request Canceled')
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
      const resp = await axios.post(`/api/companies`, data, { cancelToken: cancelToken })
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
  find: async function(params, options){
    const { cancelToken, unauthorizedCB, sendCount: send_count } = options
    try {
      const resp = await axios.get('/api/email_addresses', {
        params: {
          ...params,
          send_count
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        cancelToken: cancelToken
      })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Email Request Canceled')
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
      const resp = await axios.post(`/api/email_addresses`, data, { cancelToken: cancelToken })
      return resp.data.emailAddress
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

import axios from 'axios'
import moment from 'moment'

const invoice = {
  get: async function(id, cancelToken){
    try {
      const resp = await axios.get(`/api/invoices/${id}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  },
  getAll: async function (page, category, cancelToken){
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&category=${category}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  },
  find: async function (page, query, cancelToken){
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  },
  findByClient: async function (page, clientId, cancelToken) {
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&client_id=${clientId}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  },
  findByDate: async function (page, date, cancelToken) {
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&date_start=${date}&date_end=${moment(date).add(1, 'days').toISOString(true)}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  },
  create: async function(data, cancelToken){
    try {
      const resp = await axios.post(`/api/invoices`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  },
  update: async function(id, data, cancelToken){
    try {
      const resp = await axios.put(`/api/invoices/${id}`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  },
  delete: async function(id, cancelToken) {
    try {
      const resp = await axios.delete(`/api/invoices/${id}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Invoice Request Canceled')
      }
    }
  }
}

export {
  invoice
}

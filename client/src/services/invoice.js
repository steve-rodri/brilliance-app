import axios from 'axios'

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
  fetch: async function (searchData, cancelToken){
    let url = "/api/invoices?"
    for (const prop in searchData) {
      if (searchData[prop]) {
        url += `${prop}=${searchData[prop]}&`
      }
    }
    const arr = url.split('')
    arr.pop()
    const url2 = arr.join('')

    try {
      const resp = await axios.get(url2, { cancelToken: cancelToken })
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
  findByDate: async function (page, start, end, cancelToken) {
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&date_start=${start}&date_end=${end}`, { cancelToken: cancelToken })
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

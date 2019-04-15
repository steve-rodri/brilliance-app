import axios from 'axios'

const invoice = {
  get: async function(id){
    try {
      const resp = await axios.get(`/api/invoices/${id}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  getAll: async function (page, category){
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&category=${category}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  find: async function (page, query){
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  findByClient: async function (page, clientId) {
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&client_id=${clientId}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  create: async function(data){
    try {
      const resp = await axios.post(`/api/invoices`, data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  update: async function(id, data){
    try {
      const resp = await axios.put(`/api/invoices/${id}`, data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  delete: async function(id) {
    try {
      const resp = await axios.delete(`/api/invoices/${id}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  invoice
}

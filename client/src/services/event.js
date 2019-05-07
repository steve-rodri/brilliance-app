import axios from 'axios'

const event = {
  getAll: async function(page, data, cancelToken){
    const { category, start, end } = data
    try {
      const resp = await axios.get(`/api/events?page=${page}&category=${category}&date_start=${start}&date_end=${end}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  getOne: async function(id, cancelToken){
    try {
      const resp = await axios.get(`/api/events/${id}`, { cancelToken: cancelToken })
      return resp.data.event
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  fetch: async function(searchData, cancelToken){
    let url = "/api/events?"
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
        console.log('Event Request Canceled')
      }
    }
  },
  createNew: async function(data, cancelToken) {
    try {
      const resp = await axios.post(`/api/events`, data, { cancelToken: cancelToken })
      return resp.data.event
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  delete: async function (id, cancelToken){
    try {
      const resp = await axios.delete(`/api/events/${id}`, { cancelToken: cancelToken })
      return resp
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  update: async function(id, data, cancelToken){
    try {
      const resp = await axios.put(`/api/events/${id}`, data, { cancelToken: cancelToken })
      return resp.data.event
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  sync: async function(data, cancelToken){
    try {
      const resp = await axios.put('/api/events/sync', data, { cancelToken: cancelToken })
      return resp.data.event
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled', e.message)
      }
    }
  }
}

export {
  event
}

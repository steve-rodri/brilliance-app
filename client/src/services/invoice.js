import axios from 'axios'

const invoice = {
  getAll: async function (page){
    try {
      const resp = await axios.get(`/api/invoices?page=${page}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  findByCategory: async function(category){
    try {
      const resp = await axios.get(`/api/invoices?category=${category}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  invoice
}

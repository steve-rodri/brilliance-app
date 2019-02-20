import axios from 'axios'

const invoice = {
  getAll: async function (page, category){
    try {
      const resp = await axios.get(`/api/invoices?page=${page}&category=${category}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  invoice
}

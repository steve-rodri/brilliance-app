import axios from 'axios'

const invoice = {
  getAll: async function (){
    try {
      const resp = await axios.get('/api/invoices')
      console.log(resp.data)
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  invoice
}

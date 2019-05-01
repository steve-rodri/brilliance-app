import axios from 'axios'

const item = {
  find: async function (query, cancelToken){
    try {
      const resp = await axios.get(`/api/items?q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Item Request Canceled')
      }
    }
  }
}

export {
  item
}

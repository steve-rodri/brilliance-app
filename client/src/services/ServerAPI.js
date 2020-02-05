import axios from 'axios';
import Qs from 'qs';

export default class Request {
  constructor(table, type, o) {
    this.table = table
    this.type = type? type : 'get'
    this.params = o.params? o.params : null;
    this.data = o.data? o.data : null;
    this.options = o.options? o.options : null;
  }

  paramsSerializer(){
    return Qs.stringify(self.params, {skipNulls: true})
  }

  execute(){
    const requestOptions = () => {
      const { cancelToken, sendCount: send_count } = self.options
      return ({
        method: `${self.type}`,
        url: `/api/${self.table}`,
        data: self.data,
        params: {
          ...self.params,
          send_count
        },
        paramsSerializer: self.paramsSerializer,
        cancelToken: cancelToken
        // onDownloadProgress: function (pe) {
        //   if (pe.lengthComputable) {
        //     console.log(pe.loaded, pe.total)
        //   }
        // }
      })
     }
    const handleError = (e) => {
      const { unauthorizedCB } = self.options

      if (axios.isCancel(e)) {
        console.log(`${self.table} request canceled`)
      }

      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
    }
    try {
      const resp = await axios(requestOptions())
      return resp.data
    } catch (e) {
      handleError()
    }
  }
}

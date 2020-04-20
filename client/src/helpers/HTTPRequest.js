import axios from "axios";
import { keysToSnake, isObject } from "../helpers";
import Qs from "qs";

export class HTTPRequest {
  constructor({ route, type, id, params, data } = {}) {
    this.route = route;
    this.type = type ? type : "get";
    this.params = isObject(params) ? params : null;
    this.data = data ? keysToSnake(data) : null;
    this.url = id ? `/api${this.route}/${id}` : `/api${this.route}`;
  }

  paramsSerializer = () => {
    if (this.params.id) delete this.params.id;
    return Qs.stringify(keysToSnake(this.params), { skipNulls: true });
  };

  async execute() {
    const requestConfig = {
      method: `${this.type}`,
      url: this.url,
      paramsSerializer: this.paramsSerializer
    };

    if (this.data) requestConfig.data = this.data;
    if (this.params) requestConfig.params = this.params;
    try {
      const resp = await axios(requestConfig);
      return resp.data;
    } catch (error) {
      console.log(`${this.type} ${this.route}`, error);
      console.log("params", this.params, "data", this.data);
      if (error && error.response) throw error.response;
    }
  }
}

export default HTTPRequest;

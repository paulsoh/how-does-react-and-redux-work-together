export default class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.isAuthRequired = false;
  }

  get = () => {
    // Get from this.baseUrl;
    return fetch(this.baseUrl)
      .then(resp => resp.json())
  }

  post = (payload) => {
    // POST from this.baseUrl;
  }

  update = (id, payload) => {
    // PUT to this.baseUrl + id
  }
}

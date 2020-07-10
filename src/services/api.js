const axios = require('axios');

const api = axios.create({
  baseURL: "http://mcapi.us/server/status?ip=",
  timeout: 2000
});

module.exports = api;
const axios = require('axios');

const api = (server) => axios.create({
  baseURL: `http://mcapi.us/server/status?ip=redestone.com`,
  timeout: 2000
});

module.exports = api;
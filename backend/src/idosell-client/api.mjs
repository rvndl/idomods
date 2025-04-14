import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "X-API-KEY": process.env.API_KEY,
  },
});

export default api;

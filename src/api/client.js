// src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://10.0.2.2:5000/api', // Android Emulator localhost
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;

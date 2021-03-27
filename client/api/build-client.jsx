import axios from 'axios';

function buildAuthClient({ req }) {
  if (typeof window === 'undefined') {
    // We are on the server
    return axios.create({
      baseURL: 'http://auth-srv:3000',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
}

function buildTicketsClient({ req }) {
  if (typeof window === 'undefined') {
    // We are on the server
    return axios.create({
      baseURL: 'http://tickets-srv:3000',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
}

export { buildAuthClient, buildTicketsClient };

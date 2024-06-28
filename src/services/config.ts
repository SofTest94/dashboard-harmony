import axios from 'axios';

// const URL_BASE = process.env.API_URL_BASE;
<<<<<<< HEAD
const URL_BASE = 'https://dev-harmony-05492453a3dd.herokuapp.com/';
=======
const URL_BASE = 'https://harmony-dev-mob-58cd4e713b6a.herokuapp.com/';
>>>>>>> stage

const HarmonyApi = axios.create({
  baseURL: URL_BASE,
});

export default HarmonyApi;

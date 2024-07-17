import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

export const getRelays = async () => {
    return await  axios.get(API_URL + 'relay', { headers: authHeader() });
}

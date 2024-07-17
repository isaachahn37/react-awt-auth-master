import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from "./constants";

export const getRelays = async () => {
    return await  axios.get(API_URL + 'relay', { headers: authHeader() });
}

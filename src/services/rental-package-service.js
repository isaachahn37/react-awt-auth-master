import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from "./constants";

export const getAllPackages = async () => {
    return await  axios.get(API_URL + 'rentalpackage', { headers: authHeader() });
}

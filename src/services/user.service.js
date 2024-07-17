import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from "./constants";

class UserService {
  getPublicContent() {
    return axios.get(API_URL+ '/api/test/' + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL+ '/api/test/' + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL+ '/api/test/' + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL+ '/api/test/' + 'admin', { headers: authHeader() });
  }
}

export default new UserService();

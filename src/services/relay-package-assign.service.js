import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

const handleAssign = async (relayId, selectedPackage) => {
    const token = localStorage.getItem('token');
    return await axios.put(
        `http://your-api-url/relays/${relayId}/assign`,
        { rentalPackageId: selectedPackage },
        {
            headers: authHeader()
        }
    );
};
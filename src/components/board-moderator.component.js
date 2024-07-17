import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import {getAllPackages} from "../services/rental-package-service";
import authHeader from "../services/auth-header";

const BoardModerator = () => {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        async function fetchAllRentalPackages() {
            const { data } = await getAllPackages();
            setPackages(data);
        }
        fetchAllRentalPackages();
    }, []);
    const handleDialogOpen = (pkg = null) => {
        setSelectedPackage(pkg);
        setIsCreating(!pkg);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedPackage(null);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const packageData = {
            packageName: selectedPackage.packageName,
            addedMinutes: selectedPackage.addedMinutes,
            relayWhitelist: selectedPackage.relayWhitelist,
            price: selectedPackage.price,
        };

        if (isCreating) {
            await axios.post('http://localhost:8080/rentalpackage', packageData, {
                headers: authHeader(),
            });
        } else {
            await axios.put(`http://localhost:8080/rentalpackage/${selectedPackage.id}`, packageData, {
                headers: authHeader(),
            });
        }

        setDialogOpen(false);
        // Fetch updated packages list
        const { data } = await getAllPackages();
        setPackages(data);
    };

    return (
        <div>
            <h3>Rental Packages</h3>
            <table>
                <tr>
                    <th style={{textAlign: 'left', padding: '10px'}}>Package Name</th>
                    <th style={{textAlign: 'left', padding: '10px'}}>Minutes Added On Time</th>
                    <th style={{textAlign: 'left', padding: '10px'}}>Whitelist</th>
                    <th style={{textAlign: 'left', padding: '10px'}}>Price</th>
                    <th style={{textAlign: 'left', padding: '10px'}}>Actions</th>
                </tr>
                {packages.map((pkg) => (
                    <tr>
                        <td style={{textAlign: 'left', padding: '10px'}}>
                            {pkg.packageName}
                        </td>
                        <td style={{textAlign: 'left', padding: '10px'}}>
                            {pkg.addedMinutes}
                        </td>
                        <td style={{textAlign: 'left', padding: '10px'}}>
                            {pkg.relayWhitelist}
                        </td>
                        <td style={{textAlign: 'left', padding: '10px'}}>
                            Rp. {pkg.price}
                        </td>
                        <td style={{textAlign: 'left', padding: '10px'}}>
                            <Button onClick={() => handleDialogOpen(pkg)}>Edit</Button>
                        </td>
                    </tr>

                ))}
            </table>

            <Button onClick={() => handleDialogOpen()}>Create New Rental Package</Button>

            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isCreating ? 'Create Rental Package' : 'Update Rental Package'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Package Name"
                        type="text"
                        fullWidth
                        value={selectedPackage?.packageName || ''}
                        onChange={(e) => setSelectedPackage({...selectedPackage, packageName: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Package Whitelist"
                        type="text"
                        fullWidth
                        value={selectedPackage?.relayWhitelist || ''}
                        onChange={(e) => setSelectedPackage({...selectedPackage, relayWhitelist: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Minutes Added On Time"
                        type="number"
                        fullWidth
                        value={selectedPackage?.addedMinutes || ''}
                        onChange={(e) => setSelectedPackage({...selectedPackage, addedMinutes: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        step="0.01"
                        fullWidth
                        value={selectedPackage?.price || ''}
                        onChange={(e) => setSelectedPackage({...selectedPackage, price: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSave}>{isCreating ? 'Create' : 'Save'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BoardModerator;


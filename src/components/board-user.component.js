import React, {useEffect, useState} from 'react';
import {getRelays} from "../services/relay-service";
import {getAllPackages} from "../services/rental-package-service";
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import authHeader from "../services/auth-header";
import {API_URL} from "../services/constants";

const BoardUser = () => {
    const [relays, setRelays] = useState([]);
    const [packages, setRentalPackages] = useState([]);
    const [selectedRelay, setSelectedRelay] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [relayId, setRelayId] = useState(null);
    const [open, setOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [switchOpen, setSwitchOpen] = useState(false);
    const [relayToSwitchFrom, setRelayToSwitchFrom] = useState(null);
    const [relayToSwitchToId, setRelayToSwitchToId] = useState(null);


    const loadRelays = async () => {
        try {
            const { data } = await getRelays();
            setRelays(data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                this.props.router.navigate("/login");
            } else {
                console.error("Error loading relays:", err);
            }
        }
    };

    const loadPackages = async () => {
        try {
            const { data } = await getAllPackages();
            setRentalPackages(data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                this.props.router.navigate("/login");
            } else {
                console.error("Error loading setRentalPackages:", err);
            }
        }
    };

    useEffect(() => {
        loadRelays();
        loadPackages();
        const interval = setInterval(() => {
            loadRelays();
            loadPackages();
        }, 10000); //set your time here. repeat every 5 seconds

        return () => clearInterval(interval);
    },[]);

    const handleAssignPackage = async () => {
        console.log('handleassign :');
        console.log(selectedPackage);
        console.log(selectedRelay);
        await axios.post(API_URL + 'relaypackageapplication',
            { rentalPackageId: selectedPackage, relayId: selectedRelay.id },
            {
                headers: authHeader()
            }
        );
        setRelayId(null);
        setSelectedPackage(null);
        setAssignOpen(false);
        const { data } = await getRelays();
        setRelays(data);
    };

    const handleEdit = (relay) => {
        setSelectedRelay(relay);
        setOpen(true);
    };

    const handleAssign = (relay) => {
        setSelectedRelay(relay);
        setAssignOpen(true);
    };

    const handleForce = async (relay) => {
        await axios.put(API_URL + 'relay/forceon',
            { relayId: relay.id },
            {
                headers: authHeader()
            }
        );

        const { data } = await getRelays();
        setRelays(data);
    }
    const handleForceOff = async (relay) => {
        await axios.put(API_URL + 'relay/forceoff',
            { relayId: relay.id },
            {
                headers: authHeader()
            }
        );

        const { data } = await getRelays();
        setRelays(data);
    }
    const handleClose = () => {
        setSelectedRelay(null);
        setOpen(false);
        setAssignOpen(false);
    };
    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        await axios.put(API_URL + 'relay/'+ selectedRelay.id,
            {
                relayName: selectedRelay.relayName,
                relayDescription: selectedRelay.relayDescription,
                relayWhitelist: selectedRelay.relayWhitelist
            },
            {
                headers: authHeader()
            }
        );
        handleClose();
        setRelays(relays.map(relay => (relay.id === selectedRelay.id ? selectedRelay : relay)));
    };

    return (
        <div>
            <h3>Relays</h3>
                        <div>
                            <table>
                                <tr>
                                    <th style={{textAlign: 'left', padding: '10px'}}>Device Name</th>
                                    <th style={{textAlign: 'left', padding: '10px'}}>Device Description</th>
                                    <th style={{textAlign: 'left', padding: '10px'}}>Device Whitelist</th>
                                    <th style={{textAlign: 'left', padding: '10px'}}>State</th>
                                    <th style={{textAlign: 'left', padding: '10px'}}>On Until</th>
                                    <th style={{textAlign: 'left', padding: '10px'}}>Actions</th>
                                </tr>
                                {relays.map((relay) => (
                                    <tr>
                                        <td style={{textAlign: 'left', padding: '10px'}}>
                                            {relay.relayName}
                                        </td>
                                        <td style={{textAlign: 'left', padding: '10px'}}>
                                            {relay.relayDescription}
                                        </td>
                                        <td style={{textAlign: 'left', padding: '10px'}}>
                                            {relay.relayWhitelist}
                                        </td>
                                        {
                                            relay.onState && (
                                                <td style={{
                                                    textAlign: 'center',
                                                    backgroundColor: 'seagreen',
                                                    padding: '10px'
                                                }}>
                                                    {relay.onState ? 'ON' : 'OFF'}
                                                </td>
                                            )}{
                                        !relay.onState &&
                                        (
                                            <td style={{
                                                textAlign: 'center',
                                                backgroundColor: 'orangered',
                                                padding: '10px'
                                            }}>
                                                {relay.onState ? 'ON' : 'OFF'}
                                            </td>
                                        )}

                                        <td style={{textAlign: 'left', padding: '10px'}}>
                                            {relay.onUntil}
                                        </td>
                                        <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '4px',
                                                flexWrap: 'nowrap',
                                                overflowX: 'auto',
                                                maxWidth: '300px' // or whatever works
                                            }}>
                                                <Button size="small" variant="outlined" onClick={() => handleEdit(relay)}>Edit</Button>
                                                <Button size="small" variant="outlined" onClick={() => handleAssign(relay)}>Assign</Button>
                                                <Button size="small" variant="outlined" onClick={() => handleForceOff(relay)}>Clear</Button>
                                                <Button size="small" variant="outlined" onClick={() => {
                                                    setRelayToSwitchFrom(relay);
                                                    setSwitchOpen(true);
                                                }}>Switch</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>

            <Dialog open={open} onClose={handleClose} fullWidth
                    maxWidth="sm">
                <DialogTitle>Update Relay</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Relay Name"
                        value={selectedRelay?.relayName || ''}
                        onChange={(e) => setSelectedRelay({ ...selectedRelay, relayName: e.target.value })}
                    />
                    <TextField
                        label="Relay Description"
                        value={selectedRelay?.relayDescription || ''}
                        onChange={(e) => setSelectedRelay({ ...selectedRelay, relayDescription: e.target.value })}
                    />
                    <TextField
                        label="Relay Whitelist"
                        value={selectedRelay?.relayWhitelist || ''}
                        onChange={(e) => setSelectedRelay({ ...selectedRelay, relayWhitelist: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={assignOpen} onClose={handleClose} fullWidth
                    maxWidth="sm">
                <DialogTitle>Assign Rental Package</DialogTitle>
                <DialogContent>
                    <TextField
                        style = {{width: 250}}
                        select
                        label="Select Package"
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                    >
                        {packages.map(pkg => (
                            assignOpen && pkg.relayWhitelist === selectedRelay.relayWhitelist && (
                                    <MenuItem key={pkg.id} value={pkg.id}>
                                        {pkg.packageName}
                                    </MenuItem>
                                )
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAssignPackage}>Assign</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={switchOpen}
                onClose={() => setSwitchOpen(false)}
                fullWidth
                maxWidth="sm" // You can try 'md' or 'lg' if you want even wider
            >
                <DialogTitle>Switch OnUntil</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        select
                        label="Select target relay"
                        value={relayToSwitchToId || ''}
                        onChange={(e) => setRelayToSwitchToId(e.target.value)}
                    >
                        {relays
                            .filter(r => r.id !== relayToSwitchFrom?.id)
                            .map(r => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.relayName}
                                </MenuItem>
                            ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSwitchOpen(false)}>Cancel</Button>
                    <Button onClick={async () => {
                        try {
                            await axios.put(API_URL + 'relay/switch-onuntil', {
                                fromRelayId: relayToSwitchFrom.id,
                                toRelayId: relayToSwitchToId
                            }, {
                                headers: authHeader()
                            });

                            setSwitchOpen(false);
                            setRelayToSwitchFrom(null);
                            setRelayToSwitchToId(null);
                            const { data } = await getRelays();
                            setRelays(data);
                        } catch (err) {
                            console.error('Switch failed', err);
                        }
                    }}>Switch</Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}

export default BoardUser;


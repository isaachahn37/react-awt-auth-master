import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {API_URL} from "../services/constants";
import authHeader from "../services/auth-header";

const BoardAdmin = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    const dateString = selectedDate.toLocaleDateString("en-GB").split("/").join("-");
    try {
      const response = await axios.get(API_URL+`report/${dateString}`,
          { headers: authHeader() });
      setReport(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching report. Please try again.");
      setReport(null);
    }
  };

  return (
      <div className="container">
        <div className="header">
          <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd-MM-yyyy"
              className="date-picker"
          />
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {report && (
            <div className="report">
              <h2>Report for {report.date}</h2>
              <table>
                <tr>
                  <th style={{textAlign: 'left', padding: '10px'}}>Date Time Applied</th>
                  <th style={{textAlign: 'left', padding: '10px'}}>Minutes Added</th>
                  <th style={{textAlign: 'left', padding: '10px'}}>Relay Name</th>
                  <th style={{textAlign: 'left', padding: '10px'}}>Relay Hard ID</th>
                  <th style={{textAlign: 'left', padding: '10px'}}>Relay Whitelist</th>
                  <th style={{textAlign: 'left', padding: '10px'}}>Relay Description</th>
                  <th style={{textAlign: 'left', padding: '10px'}}>Package Name</th>
                  <th style={{textAlign: 'left', padding: '10px'}}>Package Applied Amount</th>
                </tr>
                {report.packageAppliedReports.map((item) => (
                    <tr>
                      <td><p>{item.dateTimeApplied}</p></td>
                      <td><p>{item.minutesAdded}</p></td>
                      <td><p>{item.relayName}</p></td>
                      <td><p>{item.relayHardId}</p></td>
                      <td><p>{item.relayWhitelist}</p></td>
                      <td><p>{item.relayDescription}</p></td>
                      <td><p>{item.packageName}</p></td>
                      <td><p>Rp {item.packageAppliedAmount}</p></td>
                    </tr>
                ))}
              </table>
              <h3>Total: Rp. {report.total}</h3>
            </div>
        )}
      </div>
  );
};

export default BoardAdmin;
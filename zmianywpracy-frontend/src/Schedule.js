import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Schedule = ({ token }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  // Fetch schedule on component mount
  useEffect(() => {
    if (token) {
      const fetchSchedule = async () => {
        try {
          const response = await axios.get('https://zmianywpracy-production.up.railway.app/api/schedule', {
            params: { userId: 1 },  // Zakładam, że masz ID użytkownika
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setScheduleData(response.data);
        } catch (err) {
          setError('Failed to fetch schedule');
          console.error(err);
        }
      };

      fetchSchedule();
    }
  }, [token]);

  // Handle new schedule submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://zmianywpracy-production.up.railway.app/api/schedule',
        {
          userId: 1, // Zakładając, że masz userId
          startDate,
          endDate,
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScheduleData([...scheduleData, response.data]);
      setStartDate('');
      setEndDate('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      setError('Failed to save schedule');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Schedule</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <button type="submit">Save Schedule</button>
      </form>

      <h3>Your Schedule</h3>
      <ul>
        {scheduleData.map((schedule, index) => (
          <li key={index}>
            {schedule.startDate} to {schedule.endDate}, {schedule.startTime} - {schedule.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;

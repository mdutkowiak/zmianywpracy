import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Schedule = ({ token }) => {
  const [schedule, setSchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    username: '',
    day: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState('');

  // Fetch the current week's schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('https://zmianywpracy-production.up.railway.app/api/schedule', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchedule(response.data);
      } catch (err) {
        setError('Error fetching schedule');
        console.error(err);
      }
    };
    fetchSchedule();
  }, [token]);

  // Handle form input for new schedule
  const handleChange = (e) => {
    setNewSchedule({
      ...newSchedule,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit new schedule
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://zmianywpracy-production.up.railway.app/api/schedule',
        {
          username: newSchedule.username,
          day: newSchedule.day,
          startTime: newSchedule.startTime,
          endTime: newSchedule.endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewSchedule({ username: '', day: '', startTime: '', endTime: '' });
      // Re-fetch schedule after adding a new entry
      const response = await axios.get('https://zmianywpracy-production.up.railway.app/api/schedule', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSchedule(response.data);
    } catch (err) {
      setError('Error adding new schedule');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Schedule</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={newSchedule.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Day</label>
          <input
            type="text"
            name="day"
            value={newSchedule.day}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={newSchedule.startTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={newSchedule.endTime}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Schedule</button>
      </form>
      
      <h3>Current Week's Schedule</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((entry, index) => (
            <tr key={index}>
              <td>{entry.username}</td>
              <td>{entry.day}</td>
              <td>{entry.start_time}</td>
              <td>{entry.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;

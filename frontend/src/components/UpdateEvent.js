import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Form, Button } from 'react-bootstrap';

function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    // Fetch the event data from the API
    fetch(`/api/events/${id}`)
      .then(response => response.json())
      .then(data => setEventData(data))
      .catch(error => console.error('Error fetching event:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the event data via the API
    fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Event updated:', data);
        navigate(`/events/${id}`); // Use navigate to redirect
      })
      .catch(error => console.error('Error updating event:', error));
  };

  return (
    <div>
      <h2>Update Event</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Event
        </Button>
      </Form>
    </div>
  );
}

export default UpdateEvent;
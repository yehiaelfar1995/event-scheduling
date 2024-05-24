import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import useSWR from 'swr'
import { fetcher } from '../utils/api';
import Select from 'react-select';
function AddEvent() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { data, error: errorContacts, isLoading } = useSWR('contacts', fetcher);
  const options = data?.map(user=>({label: user.name, value: user.id})) || [];
  const onSelectChange = items=> setContacts(items)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate input fields
    if (!name || !startDate || !endDate) {
      setError('All fields are required');
      return;
    }

    try {
      const req = await axios.post('http://localhost:3001/addevent', {
        name,
        startDate,
        endDate,
        contacts: contacts.map(({value})=>(value))
      });
      setSuccess('Event added successfully');
      setName('');
      setStartDate('');
      setEndDate('');
      setContacts('');
    } catch (error) {
      setError(error.response.data.error || error.message);
    }
  };

  return (
    <div>
      <h2>Add Event</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEventName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => {
              console.log({E: e.target.value})
              setStartDate(e.target.value)}
            }
          />
        </Form.Group>
        <Form.Group controlId="formEndDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formContacts">
          <Form.Label>Contacts (comma-separated)</Form.Label>
          {data?.length &&
          <Select
            defaultValue={contacts}
            isMulti
            closeMenuOnSelect={false}
            name="colors"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={onSelectChange}
          />
          }
        </Form.Group>
        <Button variant="primary" type="submit">Add Event</Button>
      </Form>
    </div>
  );
}

export default AddEvent;
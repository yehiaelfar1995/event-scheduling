import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

function AddContact() {
  debugger;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate input fields
    if (!name || !email) {

      setError('All fields are required');
      return;
    }
    if(!email.includes("@")){
        setError('Email is not in correct format');
        return;
    }

    try {
      await axios.post('http://localhost:3001/addcontact', {
        name,
        email
      });
      setSuccess('Contact added successfully');
      setName('');
      setEmail('');
    } catch (error) {
      setError('Error adding contact');
    }
  };

  return (
    <div>
      <h2>Add Contact</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formContactName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formContactEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Add Contact</Button>
      </Form>
    </div>
  );
}

export default AddContact;
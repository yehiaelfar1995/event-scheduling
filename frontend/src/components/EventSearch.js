import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';

function EventSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await axios.get(`http://localhost:3001/events/search`, {
      params: { query }
    });
    setResults(response.data);
  };

  return (
    <div>
      <h2>Search Events</h2>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="formSearchQuery">
          <Form.Label>Search Query</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Search</Button>
      </Form>
      {results.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{new Date(event.startDate).toLocaleDateString()}</td>
                <td>{new Date(event.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default EventSearch;
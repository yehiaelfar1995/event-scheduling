import React, { useState } from 'react';
import { ListGroup, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useSWR from 'swr'
import { fetcher } from '../utils/api';
import { useLocation } from 'react-router-dom';
import querystring from 'querystring';
function EventList() {
  const [date, setDate] = useState()
  const [searchWord, setSearchWord] = useState()
  const [qs, setQs] = useState()
  const applyFilter = ()=> setQs(querystring.stringify({date, searchWord}))
  const clearFilter = ()=> setQs()
  const { data, error, isLoading } = useSWR(qs ? `events?${qs}` : 'events', fetcher)
  const {state} = useLocation()
  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Event List</h2>
      {state && <Alert variant="success">{state}</Alert>}
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="text"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <Form.Label>Start Date</Form.Label>
      <Form.Control
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button onClick={applyFilter}>Filter</Button>
      &nbsp;
      <Button variant='minimal' onClick={clearFilter}>clear</Button>
      <ListGroup>
        {data.map(event => (
          <ListGroup.Item key={event.id}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default EventList;
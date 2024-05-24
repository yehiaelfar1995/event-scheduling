import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { fetcher } from '../utils/api';
import useSWR from 'swr';
import querystring from 'querystring';

function TotalDuration() {
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const qs = querystring.stringify({startDate, endDate})
  const { data, error, isLoading } = useSWR(qs ? `total?${qs}`:'total', fetcher)
  console.log({data, error})
  if (isLoading) {
    return <Spinner animation="border" />;
  }
  return (
    <Container>
    {error &&
      <Alert variant="danger">Couldn't calculate duration for specified date range</Alert>
    }

      <Card>
        <Card.Body>
          <Card.Title>Total Duration</Card.Title>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Card.Text>
            The total duration of all events is {data} days.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TotalDuration;
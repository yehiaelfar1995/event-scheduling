import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert } from 'react-bootstrap';
import useSWR from 'swr'
import { fetcher } from '../utils/api';
function LongestEvent() {
  const { data, error, isLoading } = useSWR('longestEvent', fetcher)
  console.log({data})
  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Longest Event</h2>
      {data ? (
        <Card>
          <Card.Body>
            <Card.Title>{data.name}</Card.Title>
            <Card.Text>
              Start Date: {new Date(data.startDate).toLocaleDateString()}
            </Card.Text>
            <Card.Text>
              End Date: {new Date(data.endDate).toLocaleDateString()}
            </Card.Text>
            <Card.Text>
              Duration: {Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24))} days
            </Card.Text>
            <Card.Text>
            {data?.Contacts?.length && <Card.Text>
              Contacts: {data.Contacts.map(c=><span>{c.name}, </span>)}
            </Card.Text>}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info">No events found</Alert>
      )}
    </div>
  );
}

export default LongestEvent;
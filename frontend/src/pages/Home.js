import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to the Event Manager</h1>
          <p>Manage your events efficiently and effectively.</p>
          <Button as={Link} to="/events" variant="primary" className="mr-2">View Events</Button>
          <Button as={Link} to="/add-event" variant="secondary" className="mr-2">Add Event</Button>
          <Button as={Link} to="/add-contact" variant="secondary" className="mr-2">Add Event</Button>
          <Button as={Link} to="/events/longest" variant="success" className="mr-2">Longest Event</Button>
          <Button as={Link} to="/events/total-duration" variant="info">Total Duration</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
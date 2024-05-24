import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import LongestEvent from './components/LongestEvent';
import UpdateEvent from './components/UpdateEvent';
import TotalDuration from './components/TotalDuration';
import AddEvent from './components/AddEvent';
import AddContact from './components/AddContact';
import EditEvent from './components/EditEvent';


function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Event Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/events">Event List</Nav.Link>
            <Nav.Link as={Link} to="/events/longest">Longest Event</Nav.Link>
            <Nav.Link as={Link} to="/add-event">Add Event</Nav.Link>
            <Nav.Link as={Link} to="/events/total-duration">Total Duration</Nav.Link>
            <Nav.Link as={Link} to="/add-contact">Add Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/events/longest" element={<LongestEvent />} />
          <Route path="/events/total-duration" element={<TotalDuration />} />
          <Route path="/events/:id/update" element={<UpdateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/add-contact" element={<AddContact />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
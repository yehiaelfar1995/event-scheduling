import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useSWR from 'swr'
import axios from 'axios';
import { fetcher } from '../utils/api';
import { useNavigate } from 'react-router-dom';
function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteErrror, setDeleteError] = useState(null);
  const { data, error, isLoading } = useSWR(`events/${id}`, fetcher);
  const handleDelete = async (id, name)=>{
    try {
      const req = await axios.delete(`http://localhost:3001/events/${id}`);
      if (req.status === 204) {
        navigate('/events', {state: `Event ${name} deleted successfully`})
      }
    } catch (error) {
      setDeleteError(error.response.data.error || error.message);
    }
  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      {data ? (
        <Card>
          <Card.Body>
            <Card.Title>{data.name}</Card.Title>
            {deleteErrror && <Alert variant="error">{deleteErrror}</Alert>}
            <Card.Text>
              Start Date: {new Date(data.startDate).toLocaleDateString()}
            </Card.Text>
            <Card.Text>
              End Date: {new Date(data.endDate).toLocaleDateString()}
            </Card.Text>
            {data?.Contacts?.length && <Card.Text>
              Contacts: {data.Contacts.map(c=><span>{c.name}, </span>)}
            </Card.Text>}
          </Card.Body>
          <Card.Footer className='d-flex'>
            <Button onClick={()=>navigate(`/events/${data.id}/edit`,{state: data})}>Edit</Button>
            &nbsp;
            <Button variant='danger' onClick={()=> handleDelete(data.id, data.name)}>Delete</Button>
          </Card.Footer>
        </Card>
      ) : (
        <Alert variant="info">Event not found</Alert>
      )}
    </div>
  );
}

export default EventDetail;
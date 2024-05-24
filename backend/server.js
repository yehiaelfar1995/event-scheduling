const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Op } = require('sequelize');
const db = require('./models'); // Adjust the path as necessary
const contact = require('./models/contact');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { Event, Contact,EventContact, sequelize } = db;

// Sync all models with the database
sequelize.sync();
// .then(() => {
//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
// }).catch(err => {
//   console.error('Unable to connect to the database:', err);
// });

  // app.get('/events', async (req, res, next) => {
  //   try {
  //     const events = await Event.findAll();
  //    // console.log('Events fetched:', events);
  //     res.json(events);
  //   } catch (error) {
  //     console.error('Error in /events route:', error.message);
  //     next(error);
  //   }
  // });
// Add an event
app.post('/addevent', async (req, res, next) => {
  const { name, startDate, endDate, contacts } = req.body;
  try {
    const conflicts = await db.Contact.findAll({
      include: {
        model: db.Event,
        where: {
          startDate: { [db.Sequelize.Op.lte]: endDate },
          endDate: { [db.Sequelize.Op.gte]: startDate },
        },
      },
      where: {
        id: contacts,
      },
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ error: 'Participant conflict detected' });
    }

    const event = await db.Event.create({ name, startDate, endDate });
    await event.setContacts(contacts);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// longest
app.get('/longestEvent', async (req, res, next) => {
  try {
    const events = await Event.findAll({include: {
      model: Contact
    }});
    let longestEvent = null;
    let longestDuration = 0;

    events.forEach(event => {
      const duration = new Date(event.endDate) - new Date(event.startDate);
      if (duration > longestDuration) {
        longestDuration = duration;
        longestEvent = event;
      }
    });

    res.status(200).json(longestEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// total
app.get('/total', async (req, res, next) => {
  const {startDate, endDate}  = req?.query
  const constructWhere = ()=>{
    if (!startDate && !endDate ) return {}
    const startWhere = startDate ? {startDate: { [Op.lte]: new Date(startDate) }} : {}
    const endWhere = endDate ? {endDate: { [Op.gte]: new Date(endDate) }}: {}
    return ({
      include: {
        model: Contact
      },
      where: {
        ...startWhere,
        ...endWhere
      }
    })
  }
  try {
    const events = await Event.findAll(constructWhere());
    console.log({events})
    const duration = events.reduce((acc, event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const eventDuration = (endDate - startDate) / (1000 * 60 * 60 * 24); // duration in days
      return acc + eventDuration;
    }, 0);

    res.status(200).json(duration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/addcontact', async (req, res, next) => {
  const { name, email} = req.body;
  try {
    // Create the event and associate contacts
    const contact = await Contact.create({ name, email });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

app.get('/contacts', async (req, res, next) => {
  const { name, email} = req.body;
  try {
    // Create the event and associate contacts
    const contact = await Contact.findAll();
    console.log("contactssssssssss:",contact)
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

//List all events that took place on a specific date
app.get('/events', async (req, res, next) => {
  const {date, searchWord}  = req?.query
  console.log({q: req?.query})
  const constructWhere = ()=>{
    if (!date){
      return searchWord?.length ?{
        where: {
          name: { [Op.like]: `%${searchWord}%` }
        },
      }: {}
    }else{
      return searchWord?.length ? {
        where: {
          startDate: { [Op.lte]: new Date(date) },
          endDate: { [Op.gte]: new Date(date) },
          name: searchWord?.length && { [Op.like]: `%${searchWord}%` }
        },
      }: {
        where: {
          startDate: { [Op.lte]: new Date(date) },
          endDate: { [Op.gte]: new Date(date) },
        }
      }
    }
  }
  try {
    const events = await Event.findAll(constructWhere());
    console.log('Events fetched:', events);
    res.json(events);
  } catch (error) {
    console.error('Error in /events route:', error.message);
    next(error);
  }
});

// get one event
app.get('/events/:id', async (req, res, next) => {
    const {id} = req.params
      try {
        const event = await Event.findByPk(id, {
          include: {
            model: Contact,
          },
        });
        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }
      console.log({event})
      res.json(event);
    } catch (error) {
      next(error);
    }
  });

// Update the dates of an existing event
app.put('/events/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, startDate, endDate, contacts } = req.body;
  try {
    const event = await Event.findByPk(id, {
      include: Contact,
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check for conflicting events
    const conflictingContacts = [];
    for (const contact of event.Contacts) {
      const conflictEvents = await contact.getEvents({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            {
              startDate: { [Op.between]: [startDate, endDate] },
            },
            {
              endDate: { [Op.between]: [startDate, endDate] },
            },
            {
              startDate: { [Op.lte]: startDate },
              endDate: { [Op.gte]: endDate },
            },
          ],
        },
      });

      if (conflictEvents.length > 0) {
        conflictingContacts.push(contact);
      }
    }

    if (conflictingContacts.length > 0) {
      return res.status(409).json({
        error: 'Conflict with existing events for contacts',
        conflicts: conflictingContacts,
      });
    }

    // Update the event dates
    event.name=name;
    event.startDate = startDate;
    event.endDate = endDate;
    await event.save();
    await event.setContacts(contacts);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Delete an event
app.delete('/events/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
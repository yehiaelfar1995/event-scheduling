module.exports = (sequelize, DataTypes) => {
    const EventContact = sequelize.define('EventContact', {
      EventId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Events',
          key: 'id',
        },
      },
      ContactId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id',
        },
      },
    });
  
    return EventContact;
  };
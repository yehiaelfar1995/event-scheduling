const Sequelize = require('sequelize');
const sequelize = new Sequelize('advanced_event_scheduling_db', 'your_db_username', '3570', {
  host: 'localhost',
  dialect: 'postgres', // or 'sqlite', 'postgres', 'mariadb'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Event = require('./event')(sequelize, Sequelize.DataTypes);
db.Contact = require('./contact')(sequelize, Sequelize.DataTypes);
db.EventContact = require('./eventContact')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync models
sequelize.sync();

module.exports = db;
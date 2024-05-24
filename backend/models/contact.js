module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Contact.associate = (models) => {
    Contact.belongsToMany(models.Event, { through: 'EventContacts' });
  };

  return Contact;
};
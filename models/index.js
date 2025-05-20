const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  logging: false
});

const User = require('./user')(sequelize);
const Message = require('./message')(sequelize);

// Define associations
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Message
}; 
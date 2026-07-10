const Category = require('./Category');
const Subscriber = require('./Subscriber');
const Campaign = require('./Campaign');

Category.hasMany(Subscriber, { foreignKey: 'categoryId' });
Subscriber.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = { Category, Subscriber, Campaign };
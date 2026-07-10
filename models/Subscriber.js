const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscriber = sequelize.define('Subscriber', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    isSubscribed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    sentMailCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

module.exports = Subscriber;
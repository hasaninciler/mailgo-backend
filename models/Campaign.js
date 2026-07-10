const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    targetUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    clickCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
});

module.exports = Campaign;
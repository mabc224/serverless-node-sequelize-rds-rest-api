module.exports = function(sequelize, DataTypes) {
    var Order = sequelize.define('order', {
        tenantId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        portalId: {
            type: DataTypes.STRING(30)
        },
        customerId: {
            type: DataTypes.STRING(30)
        },
        type: {
            type: DataTypes.STRING(30)
        },
        category: {
            type: DataTypes.STRING(30)
        },
        keywords: {
            type: DataTypes.STRING(30)
        },
        status: {
            type: DataTypes.STRING(30)
        },
        sysState: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        dateCreated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        dateEdited: {
            type: DataTypes.DATE(3),
            defaultValue: DataTypes.NOW
        },
        createdBy: {
            type: DataTypes.STRING(20)
        },
        editedBy: {
            type: DataTypes.STRING(20)
        }
    });
    return Order;
};
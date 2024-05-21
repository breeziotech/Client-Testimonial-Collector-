const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const organizations = sequelize.define(
    'organizations',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  organizations.associate = (db) => {
    db.organizations.belongsToMany(db.users, {
      as: 'users',
      foreignKey: {
        name: 'organizations_usersId',
      },
      constraints: false,
      through: 'organizationsUsersUsers',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.organizations.hasMany(db.analytics, {
      as: 'analytics_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organizations.hasMany(db.testimonials, {
      as: 'testimonials_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    //end loop

    db.organizations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.organizations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return organizations;
};

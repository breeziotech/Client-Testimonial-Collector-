const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const testimonials = sequelize.define(
    'testimonials',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      client_name: {
        type: DataTypes.TEXT,
      },

      testimonial_text: {
        type: DataTypes.TEXT,
      },

      rating: {
        type: DataTypes.DECIMAL,
      },

      email: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.ENUM,

        values: ['pending', 'approved', 'rejected'],
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

  testimonials.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.testimonials.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.testimonials.hasMany(db.file, {
      as: 'photo',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.testimonials.getTableName(),
        belongsToColumn: 'photo',
      },
    });

    db.testimonials.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.testimonials.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return testimonials;
};

const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TestimonialsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const testimonials = await db.testimonials.create(
      {
        id: data.id || undefined,

        client_name: data.client_name || null,
        testimonial_text: data.testimonial_text || null,
        rating: data.rating || null,
        email: data.email || null,
        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await testimonials.setOrganization(data.organization || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.testimonials.getTableName(),
        belongsToColumn: 'photo',
        belongsToId: testimonials.id,
      },
      data.photo,
      options,
    );

    return testimonials;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const testimonialsData = data.map((item, index) => ({
      id: item.id || undefined,

      client_name: item.client_name || null,
      testimonial_text: item.testimonial_text || null,
      rating: item.rating || null,
      email: item.email || null,
      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const testimonials = await db.testimonials.bulkCreate(testimonialsData, {
      transaction,
    });

    // For each item created, replace relation files

    for (let i = 0; i < testimonials.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.testimonials.getTableName(),
          belongsToColumn: 'photo',
          belongsToId: testimonials[i].id,
        },
        data[i].photo,
        options,
      );
    }

    return testimonials;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const testimonials = await db.testimonials.findByPk(
      id,
      {},
      { transaction },
    );

    await testimonials.update(
      {
        client_name: data.client_name || null,
        testimonial_text: data.testimonial_text || null,
        rating: data.rating || null,
        email: data.email || null,
        status: data.status || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await testimonials.setOrganization(data.organization || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.testimonials.getTableName(),
        belongsToColumn: 'photo',
        belongsToId: testimonials.id,
      },
      data.photo,
      options,
    );

    return testimonials;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const testimonials = await db.testimonials.findByPk(id, options);

    await testimonials.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await testimonials.destroy({
      transaction,
    });

    return testimonials;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const testimonials = await db.testimonials.findOne(
      { where },
      { transaction },
    );

    if (!testimonials) {
      return testimonials;
    }

    const output = testimonials.get({ plain: true });

    output.photo = await testimonials.getPhoto({
      transaction,
    });

    output.organization = await testimonials.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.organizations,
        as: 'organization',
      },

      {
        model: db.file,
        as: 'photo',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.client_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'testimonials',
            'client_name',
            filter.client_name,
          ),
        };
      }

      if (filter.testimonial_text) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'testimonials',
            'testimonial_text',
            filter.testimonial_text,
          ),
        };
      }

      if (filter.email) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('testimonials', 'email', filter.email),
        };
      }

      if (filter.ratingRange) {
        const [start, end] = filter.ratingRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            rating: {
              ...where.rating,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            rating: {
              ...where.rating,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.testimonials.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.testimonials.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('testimonials', 'client_name', query),
        ],
      };
    }

    const records = await db.testimonials.findAll({
      attributes: ['id', 'client_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['client_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.client_name,
    }));
  }
};

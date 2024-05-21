const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AnalyticsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const analytics = await db.analytics.create(
      {
        id: data.id || undefined,

        submitted_count: data.submitted_count || null,
        approved_count: data.approved_count || null,
        rejected_count: data.rejected_count || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await analytics.setOrganization(data.organization || null, {
      transaction,
    });

    return analytics;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const analyticsData = data.map((item, index) => ({
      id: item.id || undefined,

      submitted_count: item.submitted_count || null,
      approved_count: item.approved_count || null,
      rejected_count: item.rejected_count || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const analytics = await db.analytics.bulkCreate(analyticsData, {
      transaction,
    });

    // For each item created, replace relation files

    return analytics;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const analytics = await db.analytics.findByPk(id, {}, { transaction });

    await analytics.update(
      {
        submitted_count: data.submitted_count || null,
        approved_count: data.approved_count || null,
        rejected_count: data.rejected_count || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await analytics.setOrganization(data.organization || null, {
      transaction,
    });

    return analytics;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const analytics = await db.analytics.findByPk(id, options);

    await analytics.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await analytics.destroy({
      transaction,
    });

    return analytics;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const analytics = await db.analytics.findOne({ where }, { transaction });

    if (!analytics) {
      return analytics;
    }

    const output = analytics.get({ plain: true });

    output.organization = await analytics.getOrganization({
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
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.submitted_countRange) {
        const [start, end] = filter.submitted_countRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            submitted_count: {
              ...where.submitted_count,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            submitted_count: {
              ...where.submitted_count,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.approved_countRange) {
        const [start, end] = filter.approved_countRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            approved_count: {
              ...where.approved_count,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            approved_count: {
              ...where.approved_count,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.rejected_countRange) {
        const [start, end] = filter.rejected_countRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            rejected_count: {
              ...where.rejected_count,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            rejected_count: {
              ...where.rejected_count,
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
          count: await db.analytics.count({
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
      : await db.analytics.findAndCountAll({
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
          Utils.ilike('analytics', 'submitted_count', query),
        ],
      };
    }

    const records = await db.analytics.findAll({
      attributes: ['id', 'submitted_count'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['submitted_count', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.submitted_count,
    }));
  }
};

const db = require('../db/models');
const TestimonialsDBApi = require('../db/api/testimonials');
const processFile = require('../middlewares/upload');
const ValidationError = require('./notifications/errors/validation');
const csv = require('csv-parser');
const axios = require('axios');
const config = require('../config');
const stream = require('stream');

module.exports = class TestimonialsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await TestimonialsDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async bulkImport(req, res, sendInvitationEmails = true, host) {
    const transaction = await db.sequelize.transaction();

    try {
      await processFile(req, res);
      const bufferStream = new stream.PassThrough();
      const results = [];

      await bufferStream.end(Buffer.from(req.file.buffer, 'utf-8')); // convert Buffer to Stream

      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            console.log('CSV results', results);
            resolve();
          })
          .on('error', (error) => reject(error));
      });

      await TestimonialsDBApi.bulkImport(results, {
        transaction,
        ignoreDuplicates: true,
        validate: true,
        currentUser: req.currentUser,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let testimonials = await TestimonialsDBApi.findBy(
        { id },
        { transaction },
      );

      if (!testimonials) {
        throw new ValidationError('testimonialsNotFound');
      }

      await TestimonialsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return testimonials;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await TestimonialsDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

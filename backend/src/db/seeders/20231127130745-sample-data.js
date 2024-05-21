const db = require('../models');
const Users = db.users;

const Analytics = db.analytics;

const Notifications = db.notifications;

const Organizations = db.organizations;

const Testimonials = db.testimonials;

const AnalyticsData = [
  {
    submitted_count: 10,

    approved_count: 8,

    rejected_count: 2,

    // type code here for "relation_one" field
  },

  {
    submitted_count: 5,

    approved_count: 3,

    rejected_count: 2,

    // type code here for "relation_one" field
  },

  {
    submitted_count: 7,

    approved_count: 6,

    rejected_count: 1,

    // type code here for "relation_one" field
  },

  {
    submitted_count: 4,

    approved_count: 2,

    rejected_count: 2,

    // type code here for "relation_one" field
  },
];

const NotificationsData = [
  {
    type: 'New Testimonial',

    message: 'A new testimonial has been submitted by Jane Doe.',

    // type code here for "relation_one" field
  },

  {
    type: 'Testimonial Approved',

    message: 'Your testimonial has been approved.',

    // type code here for "relation_one" field
  },

  {
    type: 'Testimonial Rejected',

    message: 'Your testimonial has been rejected.',

    // type code here for "relation_one" field
  },

  {
    type: 'Weekly Summary',

    message: 'Here is your weekly summary report.',

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Acme Corp',

    // type code here for "relation_many" field
  },

  {
    name: 'Beta LLC',

    // type code here for "relation_many" field
  },

  {
    name: 'Gamma Inc',

    // type code here for "relation_many" field
  },

  {
    name: 'Delta Ltd',

    // type code here for "relation_many" field
  },
];

const TestimonialsData = [
  {
    client_name: 'Jane Doe',

    // type code here for "images" field

    testimonial_text:
      'The service provided by this company was outstanding! Highly recommend.',

    rating: 5,

    email: 'jane.doe@example.com',

    status: 'pending',

    // type code here for "relation_one" field
  },

  {
    client_name: 'John Smith',

    // type code here for "images" field

    testimonial_text: 'Great experience, will definitely come back!',

    rating: 4,

    email: 'john.smith@example.com',

    status: 'approved',

    // type code here for "relation_one" field
  },

  {
    client_name: 'Alice Johnson',

    // type code here for "images" field

    testimonial_text: 'Good service but could be improved.',

    rating: 3,

    email: 'alice.johnson@example.com',

    status: 'approved',

    // type code here for "relation_one" field
  },

  {
    client_name: 'Bob Brown',

    // type code here for "images" field

    testimonial_text: 'Excellent customer support and fast delivery.',

    rating: 5,

    email: 'bob.brown@example.com',

    status: 'pending',

    // type code here for "relation_one" field
  },
];

// Similar logic for "relation_many"

async function associateAnalyticWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Analytic0 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Analytic0?.setOrganization) {
    await Analytic0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Analytic1 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Analytic1?.setOrganization) {
    await Analytic1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Analytic2 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Analytic2?.setOrganization) {
    await Analytic2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Analytic3 = await Analytics.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Analytic3?.setOrganization) {
    await Analytic3.setOrganization(relatedOrganization3);
  }
}

async function associateNotificationWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification0 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Notification0?.setUser) {
    await Notification0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification1 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Notification1?.setUser) {
    await Notification1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification2 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Notification2?.setUser) {
    await Notification2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification3 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Notification3?.setUser) {
    await Notification3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

async function associateTestimonialWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Testimonial0 = await Testimonials.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Testimonial0?.setOrganization) {
    await Testimonial0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Testimonial1 = await Testimonials.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Testimonial1?.setOrganization) {
    await Testimonial1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Testimonial2 = await Testimonials.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Testimonial2?.setOrganization) {
    await Testimonial2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Testimonial3 = await Testimonials.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Testimonial3?.setOrganization) {
    await Testimonial3.setOrganization(relatedOrganization3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Analytics.bulkCreate(AnalyticsData);

    await Notifications.bulkCreate(NotificationsData);

    await Organizations.bulkCreate(OrganizationsData);

    await Testimonials.bulkCreate(TestimonialsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateAnalyticWithOrganization(),

      await associateNotificationWithUser(),

      // Similar logic for "relation_many"

      await associateTestimonialWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('analytics', null, {});

    await queryInterface.bulkDelete('notifications', null, {});

    await queryInterface.bulkDelete('organizations', null, {});

    await queryInterface.bulkDelete('testimonials', null, {});
  },
};

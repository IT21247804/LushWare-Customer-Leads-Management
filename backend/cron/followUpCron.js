const cron = require('node-cron');
const mongoose = require('mongoose');
const FollowUp = require('../models/FollowUp');
const Notification = require('../models/Notification');

// run every 10 seconds instead of every minute
const task = cron.schedule('*/10 * * * * *', async () => {
  try {
    const now = new Date();
    const dueFollowUps = await FollowUp.find({
      followUpDate: { $lte: now },
      status: { $in: ['pending', 'scheduled'] },
      notified: { $ne: true }
    }).limit(200).populate('leadId customerId'); // populate for message context

    if (!dueFollowUps.length) return;

    const notifications = dueFollowUps.map(f => ({
      message: `Follow-up due: ${f.title || 'Untitled'}${f.leadId ? ` (Lead: ${f.leadId.name})` : ''}${f.customerId ? ` (Customer: ${f.customerId.name})` : ''}`,
      link: f.leadId ? `/leads/${f.leadId._id}` : (f.customerId ? `/customers/${f.customerId._id}` : '/follow-ups'),
      read: false,
      meta: { followUpId: f._id },
      createdAt: new Date()
    }));

    // insert notifications
    await Notification.insertMany(notifications);

    // mark follow-ups as notified (or update status to 'due')
    const ids = dueFollowUps.map(f => f._id);
    await FollowUp.updateMany(
      { _id: { $in: ids } },
      { $set: { notified: true, status: 'due' } }
    );

    console.log(`Follow-up cron: created ${notifications.length} notifications`);
  } catch (err) {
    console.error('Follow-up cron error:', err);
  }
}, {
  scheduled: false
});

module.exports = {
  start: () => task.start(),
  stop: () => task.stop()
};
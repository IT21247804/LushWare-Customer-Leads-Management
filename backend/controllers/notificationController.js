const Notification = require("../models/Notification");

// Get all notifications
async function getAll(req, res) {
  try {
    const notes = await Notification.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

// Mark notification as read
async function markRead(req, res) {
  try {
    const note = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!note) return res.status(404).json({ error: "Notification not found" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
}

// Delete notification
async function remove(req, res) {
  try {
    const note = await Notification.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
}

// Create notification
async function create(req, res) {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: "message required" });

    const notification = new Notification({
      message,
      userId: userId || null,
      read: false,
    });

    const saved = await notification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, markRead, remove, create };

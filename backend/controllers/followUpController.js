const FollowUp = require("../models/FollowUp");

// GET all follow-ups
async function getAll(req, res) {
  try {
    const items = await FollowUp.find()
      .sort({ followUpDate: 1 })
      .populate("leadId")
      .populate("customerId");

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch follow-ups" });
  }
}

// CREATE follow-up
async function create(req, res) {
  try {
    const { leadId, customerId, title, notes, followUpDate } = req.body;

    const item = new FollowUp({
      leadId,
      customerId,
      title,
      notes,
      followUpDate,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET follow-up by ID
async function getById(req, res) {
  try {
    const item = await FollowUp.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Follow-up not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
}

// UPDATE follow-up
async function update(req, res) {
  try {
    const { title, notes, followUpDate, status } = req.body;

    const item = await FollowUp.findByIdAndUpdate(
      req.params.id,
      { title, notes, followUpDate, status },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ error: "Follow-up not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE follow-up
async function remove(req, res) {
  try {
    const item = await FollowUp.findByIdAndDelete(req.params.id);

    if (!item) return res.status(404).json({ error: "Follow-up not found" });

    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
}

module.exports = { getAll, create, getById, update, remove };

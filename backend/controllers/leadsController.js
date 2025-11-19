const Lead = require('../models/Lead');

async function getAll(req, res) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
}

async function create(req, res) {
  try {
    const { name, email, phone, notes } = req.body;
    const lead = new Lead({ name, email, phone, notes });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
}

async function remove(req, res) {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
}

module.exports = { getAll, create, getById, remove };
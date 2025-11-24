const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

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

async function update(req, res) {
  try {
    // whitelist allowed fields to avoid accidental/unsafe updates
    const allowed = ['name', 'email', 'phone', 'notes', 'source', 'status', 'priority', 'assignedTo', 'tags'];
    const payload = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        payload[key] = req.body[key];
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function convertLeadToCustomer(req, res) {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    // Step 1: Create customer using lead data
    const customer = new Customer({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      notes: lead.notes,
      source: "lead-conversion"
    });

    await customer.save();

    // Step 2: Update lead status
    lead.status = "converted";
    lead.convertedAt = new Date();
    await lead.save();

    res.json({
      message: "Lead converted to customer successfully",
      customer,
      lead,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, create, getById, update, remove, convertLeadToCustomer  };
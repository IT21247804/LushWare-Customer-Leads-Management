const Customer = require('../models/Customer');

// Get all customers
async function getAll(req, res) {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

// Create a customer
async function create(req, res) {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get one customer by ID
async function getById(req, res) {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ error: 'Customer not found' });

    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
}

// Update customer
async function update(req, res) {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer)
      return res.status(404).json({ error: 'Customer not found' });

    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete customer
async function remove(req, res) {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer)
      return res.status(404).json({ error: 'Customer not found' });

    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
}

async function addLog(req, res) {
  try {
    const { type = 'note', message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { $push: { communicationLogs: { type, message, timestamp: new Date() } } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addProject(req, res) {
  try {
    const project = req.body;
    if (!project || !project.projectName) return res.status(400).json({ error: 'projectName required' });

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { $push: { projectHistory: project } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteLog(req, res) {
  try {
    const { id, logId } = req.params;
    const updated = await Customer.findByIdAndUpdate(
      id,
      { $pull: { communicationLogs: { _id: logId } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteProject(req, res) {
  try {
    const { id, projectId } = req.params;
    const updated = await Customer.findByIdAndUpdate(
      id,
      { $pull: { projectHistory: { _id: projectId } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getAll, create, getById, update, remove, addLog, addProject, deleteLog, deleteProject };

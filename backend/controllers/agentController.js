import { Agent } from "../models/Agent.js";

export async function getAgents(req, res, next) {
  try {
    const search = req.query.search || "";
    const agents = await Agent.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { licenseNo: { $regex: search, $options: "i" } },
        { region: { $regex: search, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    next(error);
  }
}

export async function createAgent(req, res, next) {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (error) {
    next(error);
  }
}

export async function updateAgent(req, res, next) {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (error) {
    next(error);
  }
}

export async function deleteAgent(req, res, next) {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json({ message: "Agent deleted" });
  } catch (error) {
    next(error);
  }
}

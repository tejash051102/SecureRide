import { Manager } from "../models/Manager.js";

export async function getManagers(req, res, next) {
  try {
    const search = req.query.search || "";
    const managers = await Manager.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { branch: { $regex: search, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });
    res.json(managers);
  } catch (error) {
    next(error);
  }
}

export async function createManager(req, res, next) {
  try {
    const manager = await Manager.create(req.body);
    res.status(201).json(manager);
  } catch (error) {
    next(error);
  }
}

export async function updateManager(req, res, next) {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!manager) return res.status(404).json({ message: "Manager not found" });
    res.json(manager);
  } catch (error) {
    next(error);
  }
}

export async function deleteManager(req, res, next) {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) return res.status(404).json({ message: "Manager not found" });
    res.json({ message: "Manager deleted" });
  } catch (error) {
    next(error);
  }
}

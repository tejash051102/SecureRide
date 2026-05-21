import { Vehicle } from "../models/Vehicle.js";

export async function getVehicles(req, res, next) {
  try {
    const search = req.query.search || "";
    const base = req.user.role === "admin" ? {} : { customer: req.user._id };
    const vehicles = await Vehicle.find({
      ...base,
      $or: [
        { registrationNo: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } }
      ]
    }).populate("customer", "name email").sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
}

export async function createVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(await vehicle.populate("customer", "name email"));
  } catch (error) {
    next(error);
  }
}

export async function updateVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("customer", "name email");
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
}

export async function deleteVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    next(error);
  }
}

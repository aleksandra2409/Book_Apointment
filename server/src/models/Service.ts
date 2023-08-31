import mongoose, { Types } from "mongoose";
import { Service, ServiceCategory } from "../types";

const serviceSchema = new mongoose.Schema<Service>({
  serviceName: String,
  category: { type: String, enum: Object.values(ServiceCategory) },
  availability: Array<String>,
  duration: Number,
  price: Number,
  earlyBird: Date,
});

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;

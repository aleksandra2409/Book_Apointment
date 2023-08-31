import mongoose, { Types } from "mongoose";
import { Reservation} from "../types";
import Service from "./Service";

const reservationSchema = new mongoose.Schema<Reservation>({
  userEmail: String,
  service: { type: Object, enum: Object.values(Service) },
  date: Date,
  price: Number,
  token: String,
  promoCode: String
});

const ReservationModel = mongoose.model("Reservation", reservationSchema);

export default ReservationModel;

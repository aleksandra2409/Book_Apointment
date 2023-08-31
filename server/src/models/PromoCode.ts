import mongoose, { Types } from "mongoose";
import { PromoCode } from "../types";

const promoCodeSchema = new mongoose.Schema<PromoCode>({
  code: String,
  userEmail: String,
});

const PromoCodeModel = mongoose.model("Promo code", promoCodeSchema);

export default PromoCodeModel;

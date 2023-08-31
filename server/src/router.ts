import express, { Request, Response } from "express";
import { JWT_SECRET } from "./util/secrets";
import ReservationModel from "./models/Reservation";
import UserModel from "./models/User";
import ServiceModel from "./models/Service";
import PromoCodeModel from "./models/PromoCode";
import { LEGAL_TCP_SOCKET_OPTIONS } from "mongodb";

const router = express.Router();

// POST services
router.post("/api/service", async (req: Request, res: Response) => {
  const body = req.body;

  const newService = new ServiceModel({
    serviceName: body.serviceName,
    category: body.category,
    availability: body.availability,
    duration: body.duration,
    price: body.price,
    earlyBird: null,
  });
  const createdService = await newService.save();
  res.json(createdService);
});

// GET services
router.get("/api/service", async (req: Request, res: Response) => {
  try {
    const services = await ServiceModel.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// GET service by id
router.get("/api/service", async (req: Request, res: Response) => {
  try {
    const serviceId = req.query.serviceId;
    const service = await ServiceModel.findById(serviceId);
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// category check
router.post("/api/category", async (req: Request, res: Response) => {
  const userEmail = req.body.userEmail;
  const category = req.body.category;
  const reservations = await ReservationModel.find({ userEmail });

  if (reservations.length === 0 || !reservations) {
    return res.json({ hasCategory: false });
  }
  for (const reservation of reservations) {
    if (reservation.service.category === category) {
      return res.json({ hasCategory: true });
    }
  }

  return res.json({ hasCategory: false });
});

// POST reservation
router.post("/api/reservation", async (req: Request, res: Response) => {
  const body = req.body;

  const userEmail = body.user.email;
  function generateToken(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    let token = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }

  const token = generateToken();

  function generatePromoCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let promoCode = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      promoCode += characters.charAt(randomIndex);
    }
    return promoCode;
  }

  const promoCode = generatePromoCode();
  const oldUser = await UserModel.findOne({ userEmail });
  if (!oldUser) {
    const newUser = new UserModel({
      first_name: body.user.first_name,
      last_name: body.user.last_name,
      company: body.user.company,
      address1: body.user.address1,
      address2: body.user.address2,
      zipCode: body.user.zipCode,
      region: body.user.region,
      country: body.user.country,
      email: body.user.email,
      emailConf: true,
    });
    const createdUser = await newUser.save();
  }

  const newPromoCode = new PromoCodeModel({
    code: promoCode,
    userEmail: userEmail,
  });

  const createdPromoCode = await newPromoCode.save();

  const newReservation = new ReservationModel({
    userEmail: userEmail,
    service: body.service,
    date: body.date,
    price: body.price,
    token: token,
    promoCode: promoCode,
  });

  const createdReservation = await newReservation.save();
  return res.json(createdReservation);
});

router.post("/api/check-promo-code", async (req, res) => {
  const { promoCode, userEmail } = req.body;

  // Proverite da li postoji promo kod sa datim kodom i emailom
  const existingPromoCode = await PromoCodeModel.findOne({
    code: promoCode,
  });

  if (!existingPromoCode || userEmail === existingPromoCode.userEmail) {
    return res.json(false);
  }

  return res.json(true);
});

router.delete("/api/promo-code", async (req, res) => {
  const promoCode = req.body.promoCode;
  await PromoCodeModel.findOneAndDelete({ code: promoCode });

  return res.json({ message: "Promo code used" });
});

// PUT reservation
router.put("/api/reservation", async (req: Request, res: Response) => {
  const body = req.body;
  const token = req.body.token;
  const userEmail = req.body.userEmail;

  await ReservationModel.findOneAndUpdate(
    { token: token, userEmail: userEmail },
    {
      date: body.date,
      price: body.price,
    }
  );
  res.json({
    message: "Reservation updated",
  });
});

router.delete("/api/reservation", async (req: Request, res: Response) => {
  const token = req.body.token;
  const userEmail = req.body.userEmail;
  const price = req.body.price;

  const reservation = await ReservationModel.findOneAndDelete({
    token: token,
    userEmail: userEmail,
    price: price,
  });
  await PromoCodeModel.findOneAndDelete({ code: reservation?.promoCode });

  res.json({
    message: "Reservation canceled",
  });
});

router.get("/api/reservation", async (req: Request, res: Response) => {
  const userEmail = req.query.userEmail;
  const token = req.query.token;
  const reservation = await ReservationModel.findOne({
    userEmail: userEmail,
    token: token,
  });
  res.json(reservation);
});

export default router;

import express from "express";
import mongoose from "mongoose";
import corse from "cors";

import router from "./router";
import { MONGODB_URI } from "./util/secrets";

const PORT = 5050;

const app = express();

app.use(corse({ origin: "*" })); // TODO: change this to only allow the client app on production
app.use(express.json());
app.use(router);

const db = mongoose.connect(MONGODB_URI).then(() => {
  app.listen(PORT);
});

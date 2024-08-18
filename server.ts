import app from ".";

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE_KEY!.replace("<PASSWORD>", process.env.DATABASE_PASSWORD as string);
mongoose
  .connect(DB)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(`Error While Connected to DB ${err}`));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running on port ${port}`));

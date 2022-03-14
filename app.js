import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cardRouter from "./routes/cardRouter.js";
import userRouter from "./routes/userRouter.js";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "622d02c9f9daafb190102d47", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use("/cards", cardRouter);
app.use("/users", userRouter);
app.use("*", (req, res) =>
  res.status(404).send({ message: "Страница не существует" })
);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

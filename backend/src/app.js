import express from "express";
import cors from "cors";
import cookirParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "20kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookirParser());

//routes
//user
import userRoute from "./routes/UserRoute.js";
app.use("/api/v1/user", userRoute);
//conversation
import conversationRoute from "./routes/ConversationRoute.js";
app.use("/api/v1/conversation", conversationRoute);

import chatRoute from "./routes/ChatRoute.js";
app.use("/api/v1/chat", chatRoute);

export { app };

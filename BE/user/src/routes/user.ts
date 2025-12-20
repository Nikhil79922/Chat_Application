import express from "express";
import { getAllUsers, getAUsers, loginUser, myProfile, updateName, verifyUser } from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";
const route = express.Router()

route.post("/login", loginUser);
route.post("/verify", verifyUser);
route.get("/me", isAuth, myProfile);
route.get("/user/all", isAuth, getAllUsers);
route.get("/user/:id", getAUsers);
route.post("/updateName", isAuth, updateName);

export default route;
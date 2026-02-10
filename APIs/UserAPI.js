import exp from "express";
import { register, authenticate } from "../services/authService.js";

export const userRoute = exp.Router();

//Register user
userRoute.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({ ...userObj, role: "USER" });
  //send res
  res.status(201).json({ message: "user created", payload: newUserObj });
});




//Read all articles(protected route)
//Add comment to an article(protected route)

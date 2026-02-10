import exp from 'express'
import { authenticate } from '../services/authService.js';
export const commonRouter=exp.Router()

//login
commonRouter.post("/login",async(req,res)=>{
     //get user cred object
      let userCred = req.body;
      //call authenticate service
      let { token, user } = await authenticate(userCred);
      //save tokan as httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      //send res
      res.status(200).json({ message: "login success", payload: user });
})



//logout
//logout for User, Author and Admin
commonRouter.get('/logout', (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie('token', {
    httpOnly: true, // Must match original  settings
    secure: false,   // Must match original  settings
    sameSite: 'lax' // Must match original  settings
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});
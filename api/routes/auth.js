const router = require('express').Router();
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require("jsonwebtoken");

//REGISTRO

router.post("/register", async (req, res)=>{
    const pas = req.body.password.toString();
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password: CryptoJs.AES.encrypt(pas, process.env.CRYPTO_KEY).toString(),/*req.body.password,*/
    });
    try{
        const user = await newUser.save();
        res.status(201).json(user);
    }catch(err){
        res.status(500).json(err);
    }
   
});

//LOGIN

router.post("/login", async (req, res)=>{

    try{
        const user = await User.findOne({email: req.body.email});
        if (!user) res.status(400).json("Email not found. Please correct it and try again");

        const bytes = CryptoJs.AES.decrypt(user.password, process.env.CRYPTO_KEY);
        const pass = bytes.toString(CryptoJs.enc.Utf8);

        if(pass !== req.body.password) res.status(501).json("Wrong password. Please correct it and try again");

        const accessToken = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.CRYPTO_KEY, {expiresIn: "5d"});

        const {password, ...info} = user._doc;
        res.status(200).json({...info, accessToken});

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;

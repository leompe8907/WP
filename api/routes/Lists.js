const router = require("express").Router();
const res = require("express/lib/response");
const List = require('../models/List');
const verify = require("../verifyToken");

//CREATE
router.post("/", verify, async(req, res)=>{
    if(req.user.isAdmin){
        const newList = new List(req.body);
        try{
            const savedList = await newList.save();
            res.status(201).json(savedList); 
        }catch(err){
            res.status(500).json("Error");
        }
    }else{
        res.status(403).json("You are not allowed to perform this action");
    }
});

//DELETE
router.delete("/", verify, async(req, res)=>{
    if(req.user.isAdmin){
        try{
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json(savedList); 
        }catch(err){
            res.status(500).json("Error");
        }
    }else{
        res.status(403).json("You are not allowed to perform this action");
    }
});

//GET

router.get("/", verify, async(req, res)=>{
    const typeQuery = req.query.type;
    const genereQuery = req.query.genere;
    let lista = [];
    try{
        if(typeQuery){
            if(genereQuery){
                lista = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery, genere: genereQuery}}
                ]);
            }else{
                lista = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery}}
                ]);
            }
        }else{
            lista = await List.aggregate([
                {$sample: {size: 10}}
            ]);
        }
        
        res.status(200).json(lista);
    }catch(err){
        res.status(500).json("Hubo un error durante la carga de las listas.");
    }
});

module.exports = router; 
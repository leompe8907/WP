const router = require("express").Router();
const Movie = require('../models/Movie');
const verify = require("../verifyToken");

//CREATE
router.post("/", verify, async(req, res)=>{
    if(req.user.isAdmin){
        const newMovie = new Movie(JSON.parse(JSON.stringify(req.body)));
        try{
            
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie); 
        }catch(err){
            res.status(500).json("Error");
        }
    }else{
        res.status(403).json("You are not allowed to perform this action");
    }
});

//UPDATE
router.put("/:id", verify, async(req, res)=>{
    if(req.user.isAdmin){
        try{    

            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, 
                {$set: req.body,},
                {new: true}
            );
            res.status(200).json(updatedMovie); 
        }catch(err){
            res.status(500).json("Error");
        }
    }else{
        res.status(403).json("You are not allowed to perform this action");
    }
});

//DELETE
router.delete("/:id", verify, async(req, res)=>{
    if(req.user.isAdmin){
        try{    
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("The movie has been deleted"); 
        }catch(err){
            res.status(500).json("Error");
        }
    }else{
        res.status(403).json("You are not allowed to perform this action");
    }
});

//GET
router.get("/find/:id", verify, async(req, res)=>{
    
        try{    

            const movie = await Movie.findById(req.params.id);
            res.status(200).json(movie); 
        }catch(err){
            res.status(500).json("Error");
        }
});


//GET FEATURED
router.get("/random", verify, async(req, res)=>{

    const type = req.query.type;
    let movie;

    try{    

        if(type === 'series'){
            movie = await Movie.aggregate([
                {$match:{isMovie: false}},
                {$sample: {size:1}},
            ]);
        }else{
            movie = await Movie.aggregate([
                {$match:{isMovie: true}},
                {$sample: {size:1}},
            ]);
        }
        res.status(200).json(movie);
    }catch(err){
        res.status(500).json("Error");
    }
});

//GET ALL
router.get("/", verify, async (req, res)=>{
    if(req.user.isAdmin){
        try{
            const movies = await Movie.find();
            res.status(200).json(movies);
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You are not allowed to perform this action");
    }
});

module.exports = router;
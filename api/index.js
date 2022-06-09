//LIBRERIAS
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
//RUTAS
const authRoute = require('./routes/auth');
const userRoute = require('./routes/Users');
const movieRoute = require('./routes/Movies');
const listRoute = require('./routes/Lists');
//CONSTANTES
const listen_port = 4040;


//ME CONECTO A LA BASE DE DATOS
dotenv.config();
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log('conectate a esta gil')).catch((err)=>{console.log(err)});

app.use(cors());
app.use(express.json());

// Setea Headers para permitir CORS y distintos Methods.
app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Conent-Type, Accept, Access-Control-Request-Method');
	res.header('Access-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
//LINKEO LAS RUTAS
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/movie", movieRoute);
app.use('/api/lists', listRoute);

//SETEO EL PUERTO QUE TENGO QUE ESCUCHAR    
app.listen(listen_port, ()=>{
    console.log("el backend anda papu");
});
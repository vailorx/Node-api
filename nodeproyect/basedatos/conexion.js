const mongoose = require("mongoose");

const conexion = async() => {
    try{
        //En el curso aparecia como mongodb://localhost:27017/mi_blog pero me daba un error de mongoose connect.
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_blog')
        
        console.log("Conectado correctamente a la bbdd mi_blog");
    } catch(error){
        console.log(error);
       
    }
}

module.exports = {
    conexion
}
/*const {Router} = require("express");
const router = Router();
*/
const express = require("express");
const multer = require("multer");
const ArticleController = require("../controladores/Article");

const router = express.Router();
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./imagenes/articulos/")
    },
    filename: function(req, file, cb){
        cb(null, "articulo" + Date.now() + file.originalname);
    }
});

const subidas = multer({storage: storage});

 //Rutas de prueba
 router.get("/ruta-de-prueba", ArticleController.prueba);
 router.get("/curso", ArticleController.curso);

 //Ruta util
 router.post("/crear", ArticleController.crear);
 router.get("/articulos/:ultimos?", ArticleController.getArticles); //si le pones la interrogacion el parametro que recibes de ultimos es opcional, si no lo tiene es obligatorio
 router.get("/articulo/:id", ArticleController.uno);
 router.delete("/articulo/:id", ArticleController.borrar);
 router.put("/articulo/:id", ArticleController.editar);
 router.post("/subir-imagen/:id", [subidas.single("file0")], ArticleController.subir);
 router.get("/imagen/:fichero", ArticleController.imagen);
 router.get("/buscar/:busqueda", ArticleController.buscar);

 module.exports = router;

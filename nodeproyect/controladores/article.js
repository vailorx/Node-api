const fs = require("fs");
const { validarArticulo } = require("../helpers/validar");
const Article = require("../modelos/Article");
const path = require("path");
const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba en mi controlador de articulos",
  });
};
const curso = (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");
  return res.status(200).json([
    {
      curso: "master en react",
      autor: "Alvaro",
      url: "alvaro.webxd",
    },
    {
      curso: "master en react",
      autor: "Alvaro",
      url: "alvaro.webxd",
    },
  ]);
};

const crear = (req, res) => {
  // Recoger parametros por post a guardar

  let parametros = req.body;

  //Validar datos -libreria validator

  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //Crear el objeto a guardar
  const article = new Article(parametros);

  // Asignar valores a objetos basado en el modelo (manual o automatico)
  // manera manual: article.titulo = parametros.titulo; (no sostenible si hay muchos campos)
  // Manera automatica:
  // Guardar el articulo en la base de datos
  article
    .save()
    .then((articleSaved) => {
      if (!articleSaved) {
        return res.status(400).json({
          status: "error",
          mensaje: "No se ha guardado el articulo",
        });
      }

      // Devolver resultados
      return res.status(200).json({
        status: "success",
        article: articleSaved,
        mensaje: "Articulo guardado",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        mensaje: "Error en el servidor",
      });
    });
};

const getArticles = (req, res) => {
  let consulta = Article.find({});
  if (req.params.ultimos) {
    consulta.limit(3);
  }
  consulta
    .sort({ fecha: -1 }) //orden descendiente
    .exec()
    .then((articles) => {
      try {
        if (!articles) {
          return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado articulos",
          });
        }
        return res.status(200).send({
          status: "success",
          parametro: req.params.ultimos,
          contador: articles.length,
          articles,
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          mensaje: "Se ha producido un error",
        });
      }
    });
};

const uno = (req, res) => {
  //Recoger un id por la url

  let articulo_id = req.params.id;

  //Buscar el articulo

  Article.findById(articulo_id)
    .then((articulo) => {
      //Si no existe devolver error

      return res.status(200).json({
        status: "success",
        articulo,
      });

      //Devolver resultado
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        mensaje: "Ha ocurrido un error",
      });
    });
};

const borrar = (req, res) => {
  let articulo_id = req.params.id;

  Article.findOneAndDelete({ _id: articulo_id })
    .then((articuloDeleted) => {
      return res.status(200).json({
        status: "success",
        articulo: articuloDeleted,
        mensaje: "Metodo de borrar",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        mensaje: "Ha ocurrido un error al borrar",
      });
    });
};

const editar = (req, res) => {
  //Recoger id articulo a editar

  let articulo_id = req.params.id;

  //Recoger datos del body

  let parametros = req.body;

  //Validar datos

  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //Buscar y actualizar articulo
  //Devolver respuesta

  Article.findOneAndUpdate({ _id: articulo_id }, req.body, { new: true })
    .then((articuloActualizado) => {
      if(!articuloActualizado){
        return res.status(500).json({
          status: "error",
          mensaje: "Error al actualizar",
        });
      }
      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
      });
    })
   
};

/*
const controler = {
    properties: () => {

    }
}
module.exports = controler;
*/

const subir = (req, res) => {
  //Configurar multer (rutas)

  //Recoger el fichero de imagen subido

  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Peticion Invalida",
    });
  }
  //Nombre del archivo

  let archivo = req.file.originalname;

  //Extension del archivo

  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];
  let extension_lower = extension.toLowerCase();
  

  //Comprobar extension correcta

  if (
    extension_lower != "png" &&
    extension_lower != "jpg" &&
    extension_lower != "jpeg" &&
    extension_lower != "gif"
  ) {
    //Borrar archivo y dar respuesta

    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Imagen Invalida"
      });
    });
  } else {
    //Si todo va bien, actualizar el articulo
    //Recoger id articulo a editar

    let articulo_id = req.params.id;

    //Buscar y actualizar articulo
    //Devolver respuesta

    Article.findOneAndUpdate({ _id: articulo_id }, {imagen: req.file.filename}, { new: true })
      .then((articuloActualizado) => {

        if(!articuloActualizado){
          return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar"
          });
        }
        return res.status(200).json({
          status: "success",
          articulo: articuloActualizado,
          fichero: req.file
        });
      });

   
  }
};

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
              }); 
        }
    });

};

const buscar = (req, res) => {
    //sacar el string de busqueda
    let busqueda = req.params.busqueda;
    // find or
    Article.find({"$or": [
        { "titulo": {"$regex": busqueda, "$options": "i"}},
        { "contenido": {"$regex": busqueda, "$options": "i"}},
    ]})
    .sort({fecha: -1})
    .exec().then((articulosEcontrados) => {
        if(!articulosEcontrados || articulosEcontrados.length <= 0){
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            })
        }
        return res.status(200).json({
            status: "success",
            articulosEcontrados
        })
    })
    // Orden

    // Ejecutar consulta

    // Devolver resultado

}

module.exports = {
  prueba,
  curso,
  crear,
  getArticles,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscar
};

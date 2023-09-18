const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

//inicializar app
console.log("App de node inciada");

//Conectar a la bbdd
conexion();

//Crear servidor node
const app = express();
const puerto = 3900;
// Configurar cors- los middleware se ejecutan 1º (app es un middleware)
app.use(cors());

//Convertir body a objeto js (parsear los objetos del metodo post a objetos usables de js)
app.use(express.json()); // recibir datos con content type app/json
app.use(express.urlencoded({extended:true})); // recibiendo datos por form-urlencoded

//Rutas
const rutas_article = require("./rutas/Article.js");

//Cargo las rutas
app.use("/api", rutas_article);

//Rutas prueba hardcodeadas
//Crear rutas req-> request, res-> respuesta. Por otro lado podemos utilizar el metodo .send o .json en caso de que sea un objeto json
app.get("/probando", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");
    return res.status(200).json(
    [{
    curso: "master en react",
    autor: "Alvaro",
    url: "alvaro.webxd"
    },{
        curso: "master en react",
        autor: "Alvaro",
        url: "alvaro.webxd"
    }]);
});

app.get("/", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");
    return res.status(200).send(`
    <div>
        <h1>Probando ruta nodejs</h1>
        <p>Creando api rest con node</p>
    </div>
    `);
});
//Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("servidor corriendo en el puerto: " + puerto);
});
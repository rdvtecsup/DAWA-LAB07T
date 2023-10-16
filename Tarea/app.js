const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
app.set("views", "./views");
app.engine("ejs", require("ejs").renderFile);
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
mongoose
  .connect("mongodb://0.0.0.0:27017/musica", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });
const cancionEsquema = new mongoose.Schema({
  nombre: String,
  artista: String,
  duracion: String,
  album: String,
  genero: String,
  enlace: String
});
const Cancion = mongoose.model("Cancion", cancionEsquema);
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
  res.render('index.ejs')
})
app.post("/canciones", (req, res) => {
  console.log(req.body)
  const { nombre, artista, duracion, album, genero, enlace } = req.body;
  
  const nuevaCancion = new Cancion({
    nombre: nombre,
    artista: artista,
    duracion: duracion,
    album: album,
    genero: genero,
    enlace: enlace
  });
  console.log(nuevaCancion);
  nuevaCancion
    .save()
    .then(() => {
      res.send({message:'Cancion creada'})
    })
    .catch((error) => {
      console.error("Error creando la canción:", error);
    });
  res.redirect('/lista')
});
app.get("/lista", (req, res) => {
  Cancion.find()
    .then((canciones) => {
      const data = { canciones };
      res.render("lista_musica.ejs", { data: data });
    })
    .catch((error) => {
      console.error("Error obteniendo la lista de canciones:", error);
      res.status(500).send("Error en el servidor");
    });
});
app.post('/eliminar', (req, res) => {
  const cancionId = req.body.cancionId;
  Cancion.findOneAndDelete({ _id: cancionId })
  .then((result) => {
    if (result) {
      console.log('Canción eliminada con éxito');
      res.redirect('/lista');
    } else {
      res.status(404).send('Canción no encontrada');
    }
  })
  .catch((err) => {
    console.error('Error al eliminar la canción:', err);
    res.status(500).send('Error al eliminar la canción');
  });

  
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("MongoDB connected!");
});
app.listen(3000, () => {
  console.log("Aplicación web dinámica ejecutándose en el puerto 3000");
});

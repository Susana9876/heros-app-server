// ***** Imports *******
const express = require('express'); // Nos ayuda a levantar el servidor
const bodyParser = require('body-parser'); // Nos ayuda a transformar las peticiones a un lenguaje "entendible"
const cors = require('cors'); // Facilita la interacción entre diferentes servidores

// Attaching routing to app server
const router = require('./route/routing');

var corsOptions = {
    origin: 'http://localhost:8080'
};

// Iniciación del web server
const port = process.env.PORT || 3000; // Variable de ambiente
const app = express(); //para iniciar el servidor

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', router);

const db = require('./model/heroes.model');
console.log(db.url);
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a la base de datos');
}).catch( err => {
    console.log('No se pudo establecer la conexión a la base de datos');
    process.exit();
})

app.get('/', (req, res) => {
   res.json({ message: "Inicio a servidor de aplicación" });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const imuRoutes = require('./routes/imu');
const comserRoutes= require('./routes/comser');
const pFRoutes= require('./routes/percepcionFacturacion');
const EASRoutes= require('./routes/eas');
const crcacRoutes= require('./routes/crcac');
const oecRoutes= require('./routes/oec');
const dcfmRoutes= require('./routes/dcfm');
const docRoutes= require('./routes/doc');
const capRoutes= require('./routes/cap');
const cecapRoutes= require('./routes/cecap');
const meaRoutes = require ('./routes/mea');
const mefRoutes = require('./routes/mef')


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/imu', imuRoutes);
app.use('/api/comser',comserRoutes);
app.use('/api/percepcionFac', pFRoutes);
app.use('/api/EfectividadAtencionSolic', EASRoutes);
app.use('/api/crcac',crcacRoutes);
app.use('/api/oec', oecRoutes);
app.use('/api/dcfm',dcfmRoutes);
app.use('/api/doc', docRoutes);
app.use('/api/cap',capRoutes);
app.use('/api/cecap',cecapRoutes);
app.use('/api/mea', meaRoutes);
app.use('/api/mef', mefRoutes);


// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://adricarav0528:br7k5BNaQkMaRyNf@cluster0.hm2eqzj.mongodb.net/cfe_indicadores?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado a MongoDB Atlas');
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
})
.catch(err => console.error('Error al conectar a MongoDB Atlas:', err));
const mongoose = require('mongoose');

const indicadorSchema = new mongoose.Schema({
  id: Number,
  month: String,
  real: Number,
  meta: Number,
  division: String,
  zona: String,
  Departamento: String,
  acumulado: Number,
});

module.exports = mongoose.model('CRCAC', indicadorSchema);
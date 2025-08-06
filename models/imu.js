const mongoose = require('mongoose');

const indicadorSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    month: { type: String, required: true },
    real: { type: Number, required: true },
    meta: { type: Number, required: true },
    division: { type: String, required: false },
    zona: { type: String, required: false },
    Departamento: { type: String, required: true },
    year: { type: Number, required: true },
    acumulado: { type: Number, required: true },
});

module.exports = mongoose.model('IMU', indicadorSchema);
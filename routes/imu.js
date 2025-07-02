const express = require('express');
const router = express.Router();
const Indicador = require('../models/imu');

// Crear indicador
router.post('/', async (req, res) => {
  try {
    const nuevoIndicador = new Indicador(req.body);
    await nuevoIndicador.save();
    res.status(201).json(nuevoIndicador);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar indicador' });
  }
});

// Obtener todos los indicadores con paginación
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const indicadores = await Indicador.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Indicador.countDocuments();

    res.json({
      indicadores,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener indicadores' });
  }
});

// Obtener un indicador por _id
router.get('/:id', async (req, res) => {
  try {
    const indicador = await Indicador.findById(req.params.id);
    if (!indicador) return res.status(404).json({ error: 'Indicador no encontrado' });
    res.json(indicador);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar indicador' });
  }
});

// Actualizar un indicador
router.put('/:id', async (req, res) => {
  try {
    const indicadorActualizado = await Indicador.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!indicadorActualizado) return res.status(404).json({ error: 'Indicador no encontrado' });
    res.json(indicadorActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar indicador' });
  }
});

// Eliminar un indicador
router.delete('/:id', async (req, res) => {
  try {
    const indicador = await Indicador.findByIdAndDelete(req.params.id);
    if (!indicador) return res.status(404).json({ error: 'Indicador no encontrado' });
    res.json({ mensaje: 'Indicador eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar indicador' });
  }
});

module.exports = router;
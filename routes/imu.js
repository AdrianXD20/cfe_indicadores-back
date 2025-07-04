const express = require('express');
const router = express.Router();
const Indicador = require('../models/imu');

// Crear indicador
router.post('/', async (req, res) => {
  try {
    const nuevoIndicador = new Indicador(req.body);
    await nuevoIndicador.save();
    console.log('Indicador creado:', nuevoIndicador); // Log para depuración
    res.status(201).json(nuevoIndicador);
  } catch (error) {
    console.error('Error al crear indicador:', error);
    res.status(500).json({ error: 'Error al agregar indicador' });
  }
});

// Obtener todos los indicadores
router.get('/', async (req, res) => {
  try {
    const indicadores = await Indicador.find().sort({ createdAt: -1 });
    console.log('Indicadores devueltos:', indicadores); // Log para depuración
    res.json(indicadores);
  } catch (error) {
    console.error('Error en GET /api/imu:', error);
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
const express = require('express');
const router = express.Router();
const Indicador = require('../models/percepcionFacturacion.js');

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

// Obtener todos los indicadores
router.get('/', async (req, res) => {
  try {
    const indicadores = await Indicador.find();
    res.json(indicadores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener indicadores' });
  }
});

// Obtener un indicador por ID
router.get('/:id', async (req, res) => {
  try {
    const indicador = await Indicador.findOne({ id: parseInt(req.params.id) });
    if (!indicador) return res.status(404).json({ error: 'Indicador no encontrado' });
    res.json(indicador);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar indicador' });
  }
});

// Actualizar un indicador
router.put('/:id', async (req, res) => {
  try {
    const indicadorActualizado = await Indicador.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    res.json(indicadorActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar indicador' });
  }
});

// Eliminar un indicador
router.delete('/:id', async (req, res) => {
  try {
    await Indicador.findOneAndDelete({ id: parseInt(req.params.id) });
    res.json({ mensaje: 'Indicador eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar indicador' });
  }
});

module.exports = router;

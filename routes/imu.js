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

// Obtener todos los indicadores (con filtro opcional por año)
router.get('/', async (req, res) => {
  try {
    const { year } = req.query; // Obtener el parámetro year de la URL (ej: ?year=2025)
    let query = {}; // Objeto de consulta vacío por defecto
    if (year) {
      query.year = parseInt(year); // Convertir a número, ya que el modelo tiene year como Number
    }
    const indicadores = await Indicador.find(query).sort({ createdAt: -1 });
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

router.post('/batch', async (req, res) => {
    try {
        const indicadores = req.body; // Espera un array de objetos
        const nuevosIndicadores = await Indicador.insertMany(indicadores);
        console.log('Indicadores creados:', nuevosIndicadores);
        res.status(201).json(nuevosIndicadores);
    } catch (error) {
        console.error('Error al crear indicadores en batch:', error);
        res.status(500).json({ error: 'Error al crear indicadores en batch' });
    }
});

// Actualizar indicadores en lote
router.put('/batch', async (req, res) => {
    try {
        const indicadores = req.body; // Array de objetos con _id, month, year, real, meta, acumulado, Departamento
        const updatedIndicadores = [];

        for (const indicador of indicadores) {
            if (indicador._id) {
                // Actualizar indicador existente
                const updated = await Indicador.findByIdAndUpdate(
                    indicador._id,
                    {
                        month: indicador.month,
                        year: indicador.year,
                        real: indicador.real,
                        meta: indicador.meta,
                        acumulado: indicador.acumulado,
                        Departamento: indicador.Departamento
                    },
                    { new: true, runValidators: true }
                );
                if (updated) {
                    updatedIndicadores.push(updated);
                }
            } else {
                // Crear nuevo indicador si no tiene _id
                const newIndicador = new Indicador(indicador);
                const saved = await newIndicador.save();
                updatedIndicadores.push(saved);
            }
        }

        console.log('Indicadores actualizados/creados:', updatedIndicadores);
        res.status(200).json(updatedIndicadores);
    } catch (error) {
        console.error('Error al actualizar indicadores en batch:', error);
        res.status(500).json({ error: 'Error al actualizar indicadores' });
    }
});

module.exports = router;
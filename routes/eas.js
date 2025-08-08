const express = require('express');
const router = express.Router();
const Indicador = require('../models/eas');

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

// Actualizar indicadores en lote
router.put('/batch', async (req, res) => {
    try {
        const indicadores = req.body;
        const updatedIndicadores = [];

        for (const indicador of indicadores) {
            if (indicador._id && mongoose.isValidObjectId(indicador._id)) {
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
                if (updated) updatedIndicadores.push(updated);
            } else {
                const newIndicador = new Indicador({
                    month: indicador.month,
                    year: indicador.year,
                    real: indicador.real,
                    meta: indicador.meta,
                    acumulado: indicador.acumulado,
                    Departamento: indicador.Departamento
                });
                const saved = await newIndicador.save();
                updatedIndicadores.push(saved);
            }
        }

        if (updatedIndicadores.length === 0) {
            return res.status(400).json({ error: 'No se actualizó ningún indicador.' });
        }

        res.status(200).json({ message: 'Indicadores actualizados o creados con éxito', data: updatedIndicadores });
    } catch (error) {
        console.error('Error al actualizar indicadores:', error);
        res.status(500).json({ error: 'Error interno', details: error.message });
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

module.exports = router;

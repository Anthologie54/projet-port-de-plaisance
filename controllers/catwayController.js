const Catway = require('../models/Catway');

/**
 * Récupère la liste de tous les catways.
 */
exports.getAll = async (req, res, next) => {
  try {
    const catways = await Catway.find();
    return res.status(200).json(catways);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère un catway par son ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (catway) return res.status(200).json(catway);
    return res.status(404).json('catway_not_found');
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Crée un nouveau catway (avec contrôle des valeurs).
 */
exports.add = async (req, res, next) => {
  const temp = {
    catwayNumber: req.body.catwayNumber,
    catwayType: req.body.catwayType,
    catwayState: req.body.catwayState
  };

  if (!['long', 'short'].includes(temp.catwayType)) {
    return res.status(400).json({ error: 'invalid_catway_type' });
  }

  try {
    const catway = await Catway.create(temp);
    return res.status(201).json(catway);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'catway already used' });
    }
    return res.status(500).json(error);
  }
};

/**
 * Met à jour uniquement l'état d'un catway.
 */
exports.update = async (req, res, next) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ error: 'catway_not_found' });

    if (req.body.catwayState) {
      catway.catwayState = req.body.catwayState;
      await catway.save();
      return res.status(200).json(catway);
    } else {
      return res.status(400).json({ error: 'missing_catwayState' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Supprime un catway par son ID.
 */
exports.delete = async (req, res, next) => {
  try {
    await Catway.deleteOne({ catwayNumber: req.params.id });
    return res.status(200).json({ message: 'delete_ok' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
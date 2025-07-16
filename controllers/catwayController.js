const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation'); 
/** 
* @function getAll
 * @description 
 * Récupère la liste de tous les catways depuis la base de données et y associe leur statut de réservation.
 * Pour chaque catway, le statut est calculé en fonction de la réservation la plus récente (endDate la plus tardive) :
 *  - Si aucune réservation n'existe, le catway est marqué comme « Libre ».
 *  - Sinon, il est marqué comme « Occupé jusqu'au : [date] ».
 *
 * @async
 * @route GET /catways
 * @param {import('express').Request} req - Objet représentant la requête HTTP.
 * @param {import('express').Response} res - Objet représentant la réponse HTTP.
 * @param {import('express').NextFunction} next - Fonction permettant de passer au middleware suivant.
 *
 * @returns {Promise<void>} En cas de succès, envoie une réponse JSON (code 200) contenant un tableau d'objets avec les informations suivantes :
 *  - _id : identifiant du catway
 *  - catwayNumber : numéro du catway
 *  - catwayType : type du catway
 *  - catwayState : état du catway
 *  - status : « Libre » ou « Occupé jusqu'au : [date] »
 *
 * @throws {Error} En cas d'erreur, renvoie une réponse JSON (code 500) contenant un message d'erreur.
 * */
exports.getAll = async (req, res, next) => {
  try {
    const catways = await Catway.find();

    const catwaysWithStatus = await Promise.all(
      catways.map(async (catway) => {
        const lastReservation = await Reservation.findOne({ catwayNumber: catway.catwayNumber })
          .sort({ endDate: -1 })
          .exec();

        let status;
        if (!lastReservation) {
          status = 'Libre';
        } else {
          // Format de la date au format français
          const dateStr = lastReservation.endDate.toLocaleDateString('fr-FR');
          status = `Occupé jusqu'au : ${dateStr}`;
        }

        return {
          _id: catway._id,
          catwayNumber: catway.catwayNumber,
          catwayType: catway.catwayType,
          catwayState: catway.catwayState,
          status,
        };
      })
    );

    return res.status(200).json(catwaysWithStatus);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
/**
 * @function getById
 * @description
 * Récupère un catway en base de données à partir de son numéro passé en paramètre d'URL.
 * Si le catway existe, renvoie ses informations complètes.  
 * Si aucun catway correspondant n’est trouvé, renvoie une réponse avec le code 404 et le message « catway_not_found ».
 *
 * @async
 * @route GET /catways/:id
 * @param {import('express').Request} req - Objet représentant la requête HTTP (req.params.id contient le numéro du catway recherché).
 * @param {import('express').Response} res - Objet représentant la réponse HTTP.
 * @param {import('express').NextFunction} next - Fonction permettant de passer au middleware suivant.
 *
 * @returns {Promise<void>} En cas de succès, renvoie :
 * - Code 200 avec l'objet catway trouvé.
 * En cas d'erreur ou si le catway n'existe pas, renvoie :
 * - Code 404 avec le message « catway_not_found »
 * - Code 500 avec un objet contenant le détail de l’erreur.
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
 * @function add
 * @description
 * Crée un nouveau catway en base de données avec les données fournies dans le corps de la requête.
 * Vérifie que le type de catway est valide (doit être « long » ou « short »).  
 * En cas de succès, renvoie l'objet créé.  
 * En cas de conflit (numéro déjà utilisé), renvoie un message d'erreur spécifique.
 *
 * @async
 * @route POST /catways
 * @param {import('express').Request} req - Objet représentant la requête HTTP (contient les champs catwayNumber, catwayType et catwayState dans req.body).
 * @param {import('express').Response} res - Objet représentant la réponse HTTP.
 * @param {import('express').NextFunction} next - Fonction permettant de passer au middleware suivant.
 *
 * @returns {Promise<void>} En cas de succès, renvoie :
 * - Code 201 avec l'objet catway nouvellement créé.
 * En cas d'erreur ou de données invalides, renvoie :
 * - Code 400 avec un message « invalid_catway_type » si le type est incorrect.
 * - Code 409 avec un message « catway already used » si le numéro est déjà pris.
 * - Code 500 avec un objet contenant le détail de l’erreur.
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
 * @function update
 * @description
 * Met à jour uniquement l'état (`catwayState`) d'un catway identifié par son numéro (passé en paramètre d'URL).
 * Si le catway n’existe pas, renvoie une réponse 404.  
 * Si le champ `catwayState` est manquant dans le corps de la requête, renvoie une réponse 400.
 *
 * @async
 * @route PUT /catways/:id
 * @param {import('express').Request} req - Objet représentant la requête HTTP (req.params.id pour le numéro du catway, req.body.catwayState pour le nouvel état).
 * @param {import('express').Response} res - Objet représentant la réponse HTTP.
 * @param {import('express').NextFunction} next - Fonction permettant de passer au middleware suivant.
 *
 * @returns {Promise<void>} En cas de succès, renvoie :
 * - Code 200 avec l'objet catway mis à jour.
 * En cas d'erreur ou de données invalides, renvoie :
 * - Code 404 avec un message « catway_not_found » si le catway n’existe pas.
 * - Code 400 avec un message « missing_catwayState » si le champ n’est pas fourni.
 * - Code 500 avec un objet contenant le détail de l’erreur.
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
 * @function delete
 * @description
 * Supprime un catway en base de données à partir de son numéro passé en paramètre d'URL.
 * Renvoie toujours un message de confirmation même si aucun catway n’a été supprimé.
 *
 * @async
 * @route DELETE /catways/:id
 * @param {import('express').Request} req - Objet représentant la requête HTTP (req.params.id contient le numéro du catway à supprimer).
 * @param {import('express').Response} res - Objet représentant la réponse HTTP.
 * @param {import('express').NextFunction} next - Fonction permettant de passer au middleware suivant.
 *
 * @returns {Promise<void>} En cas de succès, renvoie :
 * - Code 200 avec un message « delete_ok ».
 * En cas d'erreur, renvoie :
 * - Code 500 avec un objet contenant le détail de l’erreur.
 */
exports.delete = async (req, res, next) => {
  try {
    await Catway.deleteOne({ catwayNumber: req.params.id });
    return res.status(200).json({ message: 'delete_ok' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
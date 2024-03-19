/**
 * @swagger
 * tags:
 *   - name: Films
 *     description: Opérations liées aux films
 * /api/movie/{id}:
 *   get:
 *     summary: Récupère un film par son identifiant.
 *     description: Récupère un film spécifique à partir de son identifiant.
 *     tags:
 *       - Films
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du film à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès. Retourne les détails du film.
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data: { movie }
 *       404:
 *         description: Film non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Film introuvable."
 *   put:
 *     summary: Met à jour un film par son identifiant.
 *     description: Modifie les détails d'un film spécifique à partir de son identifiant.
 *     tags:
 *       - Films
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du film à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: false
 *               plot:
 *                 type: string
 *                 required: false
 *               year:
 *                 type: integer
 *                 required: false
 *               poster:
 *                 type: string
 *                 required: false
 *     responses:
 *       200:
 *         description: Succès. Retourne les détails du film mis à jour.
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data: { updatedMovie }
 *       404:
 *         description: Film non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Film introuvable."
 *   delete:
 *     summary: Supprime un film par son identifiant.
 *     description: Supprime un film spécifique à partir de son identifiant.
 *     tags:
 *       - Films
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du film à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Succès. Le film a été supprimé avec succès.
 *       404:
 *         description: Film non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Film introuvable."
 */

import {OrmService} from "/services/OrmService";
import {
    ERROR_UNDEFINED,
    INTERNAL_SERVER_ERROR_MESSAGE,
    INVALID_ID_MESSAGE,
    INVALID_ID_STATUS,
    METHOD_NOT_ALLOWED_MESSAGE,
    MOVIE_DELETED_SUCCESS_MESSAGE,
    MOVIE_EDITED_SUCCESS_MESSAGE,
    MOVIE_NOT_FOUND_MESSAGE,
    STATUS_DELETED,
    STATUS_INTERNAL_ERROR,
    STATUS_NOT_ALLOWED,
    STATUS_NOT_FOUND,
    STATUS_OK
} from "../../../lib/constants";
import {ObjectId} from 'mongodb';
import {MongoConfig} from "../../configs/MongoConfig";

/**
 * Permet de lire, modifier ou supprimer un film à partir de son identifiant.
 * @param req la requête
 * @param res la réponse
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    try {
        const {method, query: {id}, body} = req;

        switch (method) {
            case 'GET':
                if (id) {
                    const movie = await OrmService.connectAndFindOne(MongoConfig.collections.movies, new ObjectId(id));
                    if (movie) {
                        res.status(STATUS_OK).json({status: STATUS_OK, data: movie});
                    } else {
                        res.status(STATUS_NOT_FOUND).json({status: STATUS_NOT_FOUND, message: MOVIE_NOT_FOUND_MESSAGE});
                    }
                } else {
                    res.status(INVALID_ID_STATUS).json({status: INVALID_ID_STATUS, message: INVALID_ID_MESSAGE});
                }
                break;

            case 'PUT':
                if (id) {
                    const updateResult = await OrmService.connectAndUpdateOne(MongoConfig.collections.movies, new ObjectId(id), body)

                    if (updateResult) {
                        res.status(STATUS_OK).json({status: STATUS_OK, message: MOVIE_EDITED_SUCCESS_MESSAGE});
                    } else {
                        res.status(STATUS_NOT_FOUND).json({status: STATUS_NOT_FOUND, message: MOVIE_NOT_FOUND_MESSAGE});
                    }
                } else {
                    res.status(INVALID_ID_STATUS).json({status: INVALID_ID_STATUS, message: INVALID_ID_MESSAGE});
                }
                break;

            case 'DELETE':
                if (id) {
                    const deleteResult = await OrmService.connectAndDeleteOne(MongoConfig.collections.movies, new ObjectId(id));
                    if (deleteResult) {
                        res.status(STATUS_DELETED).json({status: STATUS_DELETED, message: MOVIE_DELETED_SUCCESS_MESSAGE}).end();
                    } else {
                        res.status(STATUS_NOT_FOUND).json({status: STATUS_NOT_FOUND, message: MOVIE_NOT_FOUND_MESSAGE});
                    }
                } else {
                    res.status(INVALID_ID_STATUS).json({status: INVALID_ID_STATUS, message: INVALID_ID_MESSAGE});
                }
                break;

            default:
                res.status(STATUS_NOT_ALLOWED).json({message: METHOD_NOT_ALLOWED_MESSAGE});
                break;
        }
    } catch (error) {
        console.error(ERROR_UNDEFINED, error);
        res.status(STATUS_INTERNAL_ERROR).json({message: INTERNAL_SERVER_ERROR_MESSAGE});
    }
}

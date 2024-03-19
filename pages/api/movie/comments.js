/**
 * @swagger
 * tags:
 *   - name: Commentaires
 *     description: Opérations liées aux commentaires
 * /api/movie/comments:
 *   get:
 *     summary: Récupère tous les commentaires d'un film par son identifiant.
 *     description: Récupère la liste de tous les commentaires d'un film spécifique à partir de son identifiant.
 *     tags:
 *       - Commentaires
 *     parameters:
 *       - in: query
 *         name: movie_id
 *         required: true
 *         description: Identifiant du film pour lequel récupérer les commentaires.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès. Retourne la liste de tous les commentaires du film.
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data: [{ comment1 }, { comment2 }, ...]
 *       405:
 *         description: Méthode non autorisée.
 *         content:
 *           application/json:
 *             example:
 *               status: 405
 *               message: "Méthode non autorisée. Utilisez la méthode GET."
 *   post:
 *     summary: Ajoute un nouveau commentaire pour un film à la base de données.
 *     description: Ajoute un nouveau commentaire pour un film spécifique à la base de données avec les informations fournies.
 *     tags:
 *       - Commentaires
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               text:
 *                 type: string
 *               movie_id:
 *                 type: string
 *                 required: true
 *     responses:
 *       201:
 *         description: Commentaire ajouté avec succès.
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               message: "Commentaire ajouté avec succès."
 *       405:
 *         description: Méthode non autorisée.
 *         content:
 *           application/json:
 *             example:
 *               status: 405
 *               message: "Méthode non autorisée. Utilisez la méthode POST."
 */

import {OrmService} from "/services/OrmService";
import {
    DOCUMENT_BODY_REQUIRED_MESSAGE,
    ERROR_UNDEFINED,
    INVALID_ID_STATUS,
    MESSAGE_OK_CREATED_COMMENT,
    METHOD_NOT_ALLOWED_MESSAGE,
    MOVIE_ID_REQUIRED_MESSAGE,
    STATUS_CREATED, STATUS_INTERNAL_ERROR,
    STATUS_NOT_ALLOWED,
    STATUS_OK
} from "../../../lib/constants";
import {MongoConfig} from "../../configs/MongoConfig";
import {ObjectId} from "mongodb";

/**
 * Permet de récupèrer tous les commentaires d'un film spécifique ou d'ajouter un commentaire à un film spécifique.
 * NB : Pour des raisons d'optimisation: on va utiliser la même méthode POST pour la création des films ainsi que les
 * commentaires tout en spécifiant un paramètre de plus (l'identifiant du film) à la création d'un commentaire.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
    try {
        const {method, query: {movie_id}} = req;

        switch (method) {
            case 'GET':
                if (!movie_id) {
                    return res.status(INVALID_ID_STATUS).json({ status: INVALID_ID_STATUS, message: MOVIE_ID_REQUIRED_MESSAGE });
                }
                const comments = await OrmService.connectAndFindAll(MongoConfig.collections.comments, new ObjectId(movie_id) );
                res.status(STATUS_OK).json({ status: STATUS_OK, data: comments });
                break;

            case 'POST':
                const { name, email, text, movie_id } = req.body;
                if ( !movie_id ) {
                    return res.status(INVALID_ID_STATUS).json({ status: INVALID_ID_STATUS, message: DOCUMENT_BODY_REQUIRED_MESSAGE });
                }
                const result = await OrmService.connectAndInsertOne(MongoConfig.collections.comments, { name, email, text, movie_id });
                res.status(STATUS_CREATED).json({ status: STATUS_CREATED, message: MESSAGE_OK_CREATED_COMMENT, result });
                break;

            default:
                res.status(STATUS_NOT_ALLOWED).json({ message: METHOD_NOT_ALLOWED_MESSAGE });
                break;
        }
    } catch (error) {
        console.error(ERROR_UNDEFINED, error);
        res.status(STATUS_INTERNAL_ERROR).json({ message: ERROR_UNDEFINED });
    }
}

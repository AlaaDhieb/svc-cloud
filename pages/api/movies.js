/**
 * @swagger
 * tags:
 *   - name: Films
 *     description: Opérations liées aux films
 * /api/movies:
 *   get:
 *     summary: Récupère tous les films en base de données.
 *     description: Récupère la liste de tous les films présents en base de données.
 *     tags:
 *       - Films
 *     responses:
 *       200:
 *         description: Succès. Retourne la liste de tous les films.
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data: [{ movie1 }, { movie2 }, ...]
 *       405:
 *         description: Méthode non autorisée.
 *         content:
 *           application/json:
 *             example:
 *               status: 405
 *               message: "Méthode non autorisée. Utilisez la méthode GET."
 *   post:
 *     summary: Ajoute un nouveau film à la base de données.
 *     description: Ajoute un nouveau film à la base de données avec les informations fournies.
 *     tags:
 *       - Films
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               plot:
 *                 type: string
 *               year:
 *                 type: integer
 *               poster:
 *                 type: string
 *     responses:
 *       201:
 *         description: Film ajouté avec succès.
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               message: "Film ajouté avec succès."
 *       405:
 *         description: Méthode non autorisée.
 *         content:
 *           application/json:
 *             example:
 *               status: 405
 *               message: "Méthode non autorisée. Utilisez la méthode POST."
 */

import { OrmService } from "/services/OrmService";
import {
    ERROR_UNDEFINED, MESSAGE_OK_CREATED_FILM,
    METHOD_NOT_ALLOWED_MESSAGE,
    STATUS_CREATED, STATUS_INTERNAL_ERROR,
    STATUS_NOT_ALLOWED,
    STATUS_OK
} from "../../lib/constants";
import { MongoConfig } from "../configs/MongoConfig";

/**
 * Permet de récupèrer tous les films ou de créer un nouveau film.
 * @param req la requête
 * @param res la réponse sur la requête
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    try {
        switch (req.method) {
            case 'GET':
                // Récupération des 10 premiers films (pour l'exemple, à modifier au préalable)
                const movies = await OrmService.connectAndFind(MongoConfig.collections.movies);
                // Réponse avec les films
                res.status(STATUS_OK).json({ status: STATUS_OK, data: movies });
                break;

            case 'POST':
                const {title, plot, year, poster} = req.body;
                const result = await OrmService.connectAndInsertOne(MongoConfig.collections.movies, {
                    title: title,
                    plot: plot,
                    poster: poster,
                    year: parseInt(year)
                });
                res.status(STATUS_CREATED).json({ status: STATUS_CREATED, message: MESSAGE_OK_CREATED_FILM, result: result });
                break;

            default:
                // Réponse pour les méthodes non autorisées
                res.status(STATUS_NOT_ALLOWED).json({ message: METHOD_NOT_ALLOWED_MESSAGE });
                break;
        }
    } catch (error) {
        // Gestion des erreurs
        console.error(ERROR_UNDEFINED, error);
        res.status(STATUS_INTERNAL_ERROR).json({ message: ERROR_UNDEFINED });
    }
}

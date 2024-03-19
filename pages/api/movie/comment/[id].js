
/**
 * @swagger
 * /api/movie/comment/{id}:
 *   get:
 *     summary: Récupère un commentaire par son identifiant.
 *     description: Récupère un commentaire spécifique à partir de son identifiant.
 *     tags:
 *       - Commentaires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du commentaire à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès. Retourne les détails du commentaire.
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data: { comment }
 *       404:
 *         description: Commentaire non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Commentaire introuvable."
 *   put:
 *     summary: Met à jour un commentaire par son identifiant.
 *     description: Modifie les détails d'un commentaire spécifique à partir de son identifiant.
 *     tags:
 *       - Commentaires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du commentaire à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: false
 *               email:
 *                 type: string
 *                 required: false
 *               text:
 *                 type: string
 *                 required: false
 *     responses:
 *       200:
 *         description: Succès. Retourne les détails du commentaire mis à jour.
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data: { updatedComment }
 *       404:
 *         description: Commentaire non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Commentaire introuvable."
 *   delete:
 *     summary: Supprime un commentaire par son identifiant.
 *     description: Supprime un commentaire spécifique à partir de son identifiant.
 *     tags:
 *       - Commentaires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du commentaire à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Succès. Le commentaire a été supprimé avec succès.
 *       404:
 *         description: Commentaire non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Commentaire introuvable."
 */

import {ObjectId} from 'mongodb';
import {OrmService} from "../../../../services/OrmService";
import {
    COMMENT_DELETED_SUCCESS_MESSAGE,
    COMMENT_EDITED_SUCCESS_MESSAGE,
    COMMENT_NOT_FOUND_MESSAGE,
    ERROR_UNDEFINED,
    INTERNAL_SERVER_ERROR_MESSAGE,
    INVALID_ID_MESSAGE,
    INVALID_ID_STATUS,
    METHOD_NOT_ALLOWED_MESSAGE,
    STATUS_DELETED,
    STATUS_INTERNAL_ERROR,
    STATUS_NOT_ALLOWED,
    STATUS_NOT_FOUND,
    STATUS_OK
} from "../../../../lib/constants";
import {MongoConfig} from "../../../configs/MongoConfig";

/**
 * Permet de récupèrer un commentaire, de le modifier ou de le supprimer à travers son identifiant.
 * @param req la requête.
 * @param res la réponse.
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    const { method, query: { id }, body } = req;

    try {
        switch (method) {
            case 'GET':
                if (id) {
                    const comment = await OrmService.connectAndFindOne(MongoConfig.collections.comments, new ObjectId(id));
                    if (comment) {
                        res.status(STATUS_OK).json({ status: STATUS_OK, data: comment });
                    } else {
                        res.status(STATUS_NOT_FOUND).json({ status: STATUS_NOT_FOUND, message: COMMENT_NOT_FOUND_MESSAGE });
                    }
                } else {
                    res.status(INVALID_ID_STATUS).json({ status: INVALID_ID_STATUS, message: INVALID_ID_MESSAGE });
                }
                break;

            case 'PUT':
                if (id) {
                    const updateResult = await OrmService.connectAndUpdateOne(MongoConfig.collections.comments, new ObjectId(id), body);
                    if (updateResult) {
                        res.status(STATUS_OK).json({ status: STATUS_OK, message: COMMENT_EDITED_SUCCESS_MESSAGE, data: body });
                    } else {
                        res.status(STATUS_NOT_FOUND).json({ status: STATUS_NOT_FOUND, message: COMMENT_NOT_FOUND_MESSAGE });
                    }
                } else {
                    res.status(INVALID_ID_STATUS).json({ status: INVALID_ID_STATUS, message: INVALID_ID_MESSAGE });
                }
                break;

            case 'DELETE':
                if (id) {
                    const deleteResult = await OrmService.connectAndDeleteOne(MongoConfig.collections.comments, new ObjectId(id));
                    if (deleteResult) {
                        res.status(STATUS_DELETED).json({status: STATUS_DELETED, message: COMMENT_DELETED_SUCCESS_MESSAGE}).end();
                    } else {
                        res.status(STATUS_NOT_FOUND).json({ status: STATUS_NOT_FOUND, message: COMMENT_NOT_FOUND_MESSAGE });
                    }
                } else {
                    res.status(INVALID_ID_STATUS).json({ status: INVALID_ID_STATUS, message: INVALID_ID_MESSAGE });
                }
                break;

            default:
                res.status(STATUS_NOT_ALLOWED).json({ message: METHOD_NOT_ALLOWED_MESSAGE });
                break;
        }
    } catch (error) {
        console.error(ERROR_UNDEFINED, error);
        res.status(STATUS_INTERNAL_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
}

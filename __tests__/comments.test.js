import {OrmService} from "/services/OrmService";
import {MongoConfig} from "../../configs/MongoConfig";
import {ObjectId} from "mongodb";

// Mocking OrmService
jest.mock('/services/OrmService');

describe('Gestionnaire d\'API de Commentaires', () => {
    let req, res;

    beforeEach(() => {
        req = {
            method: '',
            query: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/movie/comments', () => {
        it('devrait renvoyer tous les commentaires pour un film spécifique', async () => {
            req.method = 'GET';
            req.query.movie_id = '123456789012'; // ID de film fictif

            const expectedComments = [{ id: '1', text: 'Commentaire 1' }, { id: '2', text: 'Commentaire 2' }];
            OrmService.connectAndFindAll.mockResolvedValue(expectedComments);

            await handler(req, res);

            expect(OrmService.connectAndFindAll).toHaveBeenCalledWith(MongoConfig.collections.comments, new ObjectId('123456789012'));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 200, data: expectedComments });
        });

        it('devrait renvoyer une erreur 400 si le paramètre movie_id est manquant', async () => {
            req.method = 'GET';

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ status: 400, message: 'ID du film requis' });
        });
    });

    describe('POST /api/movie/comments', () => {
        it('devrait ajouter un nouveau commentaire pour un film spécifique', async () => {
            req.method = 'POST';
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                text: 'Super film!',
                movie_id: '123456789012' // ID de film fictif
            };

            const expectedComment = { id: '3', name: 'John Doe', email: 'john@example.com', text: 'Super film!', movie_id: '123456789012' };
            OrmService.connectAndInsertOne.mockResolvedValue(expectedComment);

            await handler(req, res);

            expect(OrmService.connectAndInsertOne).toHaveBeenCalledWith(MongoConfig.collections.comments, req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ status: 201, message: 'Commentaire ajouté avec succès', result: expectedComment });
        });

        it('devrait renvoyer une erreur 400 si movie_id est manquant dans le corps de la requête', async () => {
            req.method = 'POST';
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                text: 'Super film!'
            };

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ status: 400, message: 'ID du film requis' });
        });
    });

    describe('Méthode invalide', () => {
        it('devrait renvoyer une erreur 405 pour une méthode invalide', async () => {
            req.method = 'PUT';

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.json).toHaveBeenCalledWith({ message: 'Méthode non autorisée' });
        });
    });

    describe('Erreur interne du serveur', () => {
        it('devrait renvoyer une erreur 500 pour une erreur interne du serveur', async () => {
            req.method = 'GET';
            req.query.movie_id = '123456789012'; // ID de film fictif

            OrmService.connectAndFindAll.mockRejectedValue(new Error('Erreur de base de données'));

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur interne du serveur' });
        });
    });
});

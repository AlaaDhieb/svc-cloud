import { OrmService } from "/services/OrmService";
import { MongoConfig } from "../../configs/MongoConfig";
import { ObjectId } from "mongodb";

// Mocking OrmService
jest.mock('/services/OrmService');

describe('Gestionnaire d\'API de Films', () => {
    let req, res;

    beforeEach(() => {
        req = {
            method: '',
            query: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/movie/{id}', () => {
        it('devrait renvoyer les détails d\'un film spécifique', async () => {
            req.method = 'GET';
            req.query.id = '123456789012'; // ID de film fictif

            const expectedMovie = { id: '123456789012', title: 'Film A', year: 2022 };
            OrmService.connectAndFindOne.mockResolvedValue(expectedMovie);

            await handler(req, res);

            expect(OrmService.connectAndFindOne).toHaveBeenCalledWith(MongoConfig.collections.movies, new ObjectId('123456789012'));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 200, data: expectedMovie });
        });

        it('devrait renvoyer une erreur 400 si l\'ID du film est manquant', async () => {
            req.method = 'GET';

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ status: 400, message: 'ID du film requis' });
        });

        it('devrait renvoyer une erreur 404 si le film n\'est pas trouvé', async () => {
            req.method = 'GET';
            req.query.id = '123456789012';

            OrmService.connectAndFindOne.mockResolvedValue(null);

            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ status: 404, message: 'Film introuvable' });
        });
    });
});

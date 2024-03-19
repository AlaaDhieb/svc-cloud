import clientPromise from "../lib/mongodb";
import {MongoConfig} from "../pages/configs/MongoConfig";
import {ObjectId} from "mongodb";

/**
 * Permet de se connecter à la BDD.
 * @returns {Promise<Db>}
 */
const connectToDb = async () => {
    const client = await clientPromise;
    return client.db(MongoConfig.samples.mflix);
}

/**
 * Définit la liste des méthodes utilisées au sein de l'application afin de lire, modifier, supprimer ou ajouter de nouvelles données.
 * Les méthodes sont communes entre les traitements des collections "Movies" et "Comments".
 * @type {{connectAndFindAll: (function(*, *): Promise<WithId<Document>[]>), connectAndFind: (function(*): Promise<WithId<Document>[]>), connectAndUpdateOne: (function(*, *, *): Promise<UpdateResult>), connectAndFindOne: (function(*, *): Promise<(Document & {_id: InferIdType<Document>})|null>), connectAndDeleteOne: (function(*, *): Promise<boolean>), connectAndInsertOne: (function(*, *): Promise<InsertOneResult<Document>>)}}
 */
export const OrmService = {

    /**
     * Se connecte à la BDD et récupère une liste de films ou de commentaires.
     * @param dbName le nom de la collection
     * @returns {Promise<WithId<Document>[]>}
     */
    connectAndFind: async (dbName) => {
        const db = await connectToDb();
        return await db.collection(dbName).find({}).limit(10).toArray();
    },

    /**
     * Se connecte à la BDD et récupère tous les commentaires d'un film.
     * @param dbName le nom de la collection
     * @param id identifiant du film
     * @returns {Promise<WithId<Document>[]>}
     */
    connectAndFindAll: async (dbName, id) => {
        const db = await connectToDb();
        return await db.collection(dbName).find({movie_id: id}).limit(10).toArray();
    },

    /**
     * Se connecte à la BDD et récupère un film ou un commentaire.
     * @param dbName nom de la collection
     * @param id identifiant recherché
     * @returns {Promise<(Document & {_id: InferIdType<Document>})|null>}
     */
    connectAndFindOne: async (dbName, id) => {
        const db = await connectToDb();
        return await db.collection(dbName).findOne({_id: id});
    },

    /**
     * Se connecte et insère un objet film ou commentaire en BDD.
     * @param dbName le nom de la collection
     * @param document le document qu'on va insérer
     * NB : Pour des raisons d'optimisation: on va utiliser la même méthode POST pour la création des films ainsi que les
     * commentaires tout en spécifiant un paramètre de plus (l'identifiant du film) à la création d'un commentaire.
     * La date de création du commentaire est aussi spécifique à l'ajout des commentaires, d'où le contrôle sur la présence de movie_id
     * dans le document.
     * @returns {Promise<InsertOneResult<Document>>}
     */
    connectAndInsertOne: async (dbName, document) => {
        const db = await connectToDb();
        if (document.movie_id != null) {
            document.movie_id = new ObjectId(document.movie_id);
            document.date = new Date();
        }
        const result = await db.collection(dbName).insertOne(document);
        return result;
    },

    /**
     * Se connecte et modifie un document d'une collection.
     * @param dbName le nom de collection
     * @param id identifiant
     * @param newData les mises à jour à appliquer
     * @returns {Promise<UpdateResult>}
     */
    connectAndUpdateOne: async (dbName, id, newData) => {
        const db = await connectToDb();
        const result = await db.collection(dbName).updateOne({_id: id}, {$set: newData});
        return result;
    },

    /**
     * Se connecte et supprime un document d'une collection.
     * @param dbName nom de la collection
     * @param id identifiant du document.
     * @returns {Promise<boolean>}
     */
    connectAndDeleteOne: async (dbName, id) => {
        const db = await connectToDb();
        const result = await db.collection(dbName).deleteOne({_id: id});
        return result.deletedCount > 0;
    }
}

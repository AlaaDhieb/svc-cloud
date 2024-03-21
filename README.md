## MFLIX
### Description du projet 
Ce projet permet d'exploiter l'architecture CLOUD de MongoDB connue par ATLAS afin de la lier
à ce projet en NextJS et de créer des routes API ainsi qu'une documentation Swagger pour pouvoir les exploiter.

### Base de données
- La base de données est déployée sur un cluster ATLAS de MongoDB.
- La base de données contient deux collections, films ("Movies") et commentaires ("Comments").

### Documentation API (Swagger)
- Le swagger permet d'effectuer des traitements sur deux collections différentes de MongoDB.
- Il permet de créer, modifier, supprimer et lire un ou plusieurs films.
- Il permet de créer, modifier, supprimer et lire un ou plusieurs commentaires de films.
- Les méthodes GET permettent de lire un document ou plusieurs.
- Les méthodes POST permettent d'ajouter un commentaire ou un film.
- Les méthodes PUT permettent de mettre à jour un ou plusieurs champs d'un document d'une collection.
- Les méthodes DELETE permettent de supprimer des documents de l'une des deux collections.

### Projet node

# Description:

Cette application est une API utilisan mongoDB et fastify, le sujet est un "jeux" sur le thème des samourais, dans lequel vous incarnez un de ces dernier qui doit s'entrainer et créer des armes.

Les samourai possèdent les statistiques suivantes

- force (les dégâts)
- determination (points de vies)
- habileté (dégâts critiques)
- patience (meilleures armes)
- sagesse (meilleures entraînement)

Les armes possèdent les statistiques suivantes:

- efficacité (les dégâts)
- poids (chance de coups critiques)
- rareté (juste pour frimer)
- nom (plutôt explicite)

Voici les différents lieux et actions permettant de modifier ou créer des choses:

## /temple: 

- /temple (voir son samourai) (READ : get)

### Entraîner son samourai:

- /temple/meditating (sagesse) (UPDATE : put)

- /temple/bodytraining (determination) (UPDATE : put)

- /temple/fieldtraining (force) (UPDATE : put)


## /forge

- /forge (voir ses armes) (READ : get)

### Fabriquer des armes

- /forge/anvil (CREATE : post)

- /forge/temper (efficacité) (UPDATE : put)

- /forge/grindstone (poids) (UPDATE : put)

- /forge/melter/:name: (DELETE weapon by name : delete)

- /forge/fastmelter (DELETE last weapon : delete)


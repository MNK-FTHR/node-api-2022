const fastify = require('fastify')({ logger: true });

const samourai = {
    force: 5,
    determination: 10,
    habilete: 5,
    patience: 1,
    sagess: 5
};

const weapons = new Map();
const Weapon = class {
    constructor(efficacite, poids, rarete) {
        this.efficacite = efficacite;
        this.poids = poids;
        this.rarete = rarete;
    }
};
const weaponNames = ["Tachi", "Nodachi", "Masakari", "Yari", "Naginata", "Wakisashi", "Yumi", "Katana", "Clé a molette", "Tanto", "Knacki Herta", "Feuille des impôts", "Streams Promises API"]

// Temple
fastify.get('/temple', async (request, reply) => {
  return {"Votre samourai": samourai};
});

// Forge
weapons.set(weaponNames[Math.floor(Math.random()*weaponNames.length)], new Weapon(2, 15, 10));
fastify.get('/forge', async (request, reply) => {
    let list = [];
    for (let [key, value] of weapons) {
        list.push({nom: key, stats: value})
    };
    return  list;
});

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};
start();
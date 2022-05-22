const fastify = require('fastify')({ logger: true });
require('dotenv').config();

const mongoose = require('mongoose');
const { Schema } = mongoose;
const samouraiSchema = new Schema({
    force: { type: Number, required: true },
    determination: { type: Number, required: true },
    habilete: { type: Number, required: true },
    patience: { type: Number, required: true },
    sagesse: { type: Number, required: true },
});
const weaponSchema = new Schema({
    efficacite: { type: Number, required: true },
    poids: { type: Number, required: true },
    rarete: { type: Number, required: true },
    nom: { type: String, required: true },
});
const Samourai = mongoose.model('samourai', samouraiSchema);
const Weapon = mongoose.model('weapon', weaponSchema);
const weaponNames = ["Tachi", "Nodachi", "Masakari", "Yari", "Naginata", "Wakisashi", "Yumi", "Katana",
    "Tanto", "Clé a molette", "Knacki Herta", "Feuille des impôts", "VS Code, thème clair", "Patrick Balkany",
    "Revolver silencieux OTs-38 Stetchkine"
]
try {
    mongoose.connect(process.env.MONGO_URL)
  } catch (e) {
    console.error(e);
  }
// Temple
fastify.get('/temple', async (request, reply) => {
    const samourai = await Samourai.find({});
    if (samourai.length) {
        
        return {"Votre samourai": samourai[0]};
    }else{
        const newSamourai = await Samourai.create( {
            force: 5,
            determination: 10,
            habilete: 5,
            patience: 1,
            sagesse: 5
        });
        reply.code(201).send(newSamourai);
        return {"Votre samourai": samourai};
    }
});
fastify.put('/temple/:action', async (request, reply) => {
    const samourai = await Samourai.find({});
    let updatedSamourai = samourai[0];
    if (samourai.length) {
        let resp = ""
        switch (request.params.action) {
            case "meditating":
                resp = "Votre samourai a bien médité";
                updatedSamourai.sagesse = (samourai[0].sagesse * 1.1).toFixed(2);
                await Samourai.findByIdAndUpdate(updatedSamourai.id, updatedSamourai);
                break;
            case "bodytraining":
                resp = "Votre samourai s'est bien entrainé";              
                updatedSamourai.determination = (samourai[0].determination * 1.1 * (1+(samourai[0].sagesse/50))).toFixed(2);
                await Samourai.findByIdAndUpdate(updatedSamourai.id, updatedSamourai);
                break;
            case "fieldtraining":
                resp = "Votre samourai s'est bien battu";              
                updatedSamourai.force = (samourai[0].force * 1.1 * (1+(samourai[0].sagesse/40))).toFixed(2);
                await Samourai.findByIdAndUpdate(updatedSamourai.id, updatedSamourai)
                break;
        }
        return resp;
    }else{
        return "Bah alors ? on essaye de casser le code ???"
    }
});
// Forge
fastify.get('/forge', async (request, reply) => {
    const weapon = await Weapon.find({});
    return  weapon;
});
fastify.post('/forge/anvil', async (request, reply) => {
    const samourai = await Samourai.find({});
    const weapons = await Weapon.find({});
    if (samourai.length) {
        let updatedSamourai = samourai[0]; 
        let stats = new Map();
        stats.set('minEff', (10 * (1+ samourai[0].patience/20)));
        stats.set('maxEff', (10 * (1+ samourai[0].patience/10)));
        stats.set('minPoids', (50/(1+ samourai[0].patience/10)));
        stats.set('maxPoids', (50/(1+ samourai[0].patience/20)));
        let weaponName = weaponNames[Math.floor(Math.random()*weaponNames.length)];
        if (weapons.length && weapons.map(w =>  w.nom).includes(weaponName)) {
            await Weapon.findByIdAndDelete(weapons.filter(w=> w.nom == weaponName)[0].id)
        }
        const weapon = await Weapon.create({
            efficacite: Math.floor(Math.random() * (stats.get('maxEff') - stats.get('minEff')) + stats.get('minEff')),
            poids: Math.floor(Math.random() *  (stats.get('maxPoids') - stats.get('minPoids')) + stats.get('minPoids')),
            rarete: Math.floor(Math.random() * 11),
            nom: weaponName
        });
        updatedSamourai.patience = samourai[0].patience + 1 * (1+weapons.length/50);
        await Samourai.findByIdAndUpdate(updatedSamourai.id, updatedSamourai);
        return  "C'est en forgeant qu'on se fait des ampoules";
    }else{
        return "Bah alors ? on essaye de casser le code ???"
    }
});

fastify.put('/forge/:tool/:name', async (request, reply) => {
    const samourai = await Samourai.find({});
    const weapons = await Weapon.find({});
    let updatedWeapon = weapons.filter(f=>f.nom == request.params.name)[0];
    let updatedSamourai = samourai[0]
    switch (request.params.tool) {
        case "temper":
            updatedWeapon.efficacite = (weapons.filter(f=>f.nom == request.params.name)[0].efficacite + 1*(1*samourai[0].patience/20)).toFixed(2);
            await Weapon.findByIdAndUpdate(
                updatedWeapon._id,
                updatedWeapon
            );
            break;
        case "grindstone":
            updatedWeapon.poids = (weapons.filter(f=>f.nom == request.params.name)[0].poids + 1*(1*samourai[0].patience/20)).toFixed(2);
            await Weapon.findByIdAndUpdate(
                updatedWeapon.id,
                updatedWeapon
            );
            break;
    }
    updatedSamourai.patience = samourai[0].patience + 1 * (1+weapons.length/75);
    await Samourai.findByIdAndUpdate(updatedSamourai.id, updatedSamourai);
    return updatedWeapon
});

fastify.delete('/forge/melter/:name', async (request, reply) => {
    const weapons = await Weapon.find({});
    if (weapons.filter(w=>w.nom == request.params.name).length) {
        await Weapon.deleteOne(weapons.filter(w=>w.nom == request.params.name)[0]);
        return "Vous jetez "+request.params.name+" dans la fonderie"
    } else {
        return "Vous n'avez pas d'armes"
    }
});

fastify.delete('/forge/:trash', async (request, reply) => {
    const weapons = await Weapon.find({});
    let kept = weapons[weapons.length - 1];
    let resp = ""
    console.log(kept);
    if (weapons.length) {
        switch (request.params.trash) {
            case "fastmelter":
                resp = "Vous jetez votre dernière création au feu"
                    await Weapon.deleteOne(kept);
                    break;
                    case "ragemelt":
                resp = "Vous jetez TOUT sauf votre dernière création au feu"
                await Weapon.deleteMany({});
                await Weapon.create({
                    efficacite: kept.efficacite,
                    poids: kept.poids,
                    rarete: kept.rarete,
                    nom: kept.nom,
                })
                break;
        }
    }else{
        resp = "Vous n'avez pas d'armes"
    }
    return resp;
});
// Redirect
fastify.get('/', async (request, reply) => {
    reply.redirect('/temple');
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
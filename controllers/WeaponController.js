const Weapon=require('../models/Weapon');
const Samourai=require('../models/Samourai');
const weaponNames = ["Tachi", "Nodachi", "Masakari", "Yari", "Naginata", "Wakisashi", "Yumi", "Katana",
    "Tanto", "Clé a molette", "Knacki Herta", "Feuille des impôts", "VS Code, thème clair", "Patrick Balkany",
    "Revolver silencieux OTs-38 Stetchkine"
]
let ShowWeapons = async (request, reply) => {
    const weapon = await Weapon.find({});
    return  weapon;
}

let CreateWeapon = async (request, reply) => {
    const samourai = await Samourai.find({});
    const weapons = await Weapon.find({});
    // Créer une arme aléatoire
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
        await Weapon.create({
            efficacite: Math.floor(Math.random() * (stats.get('maxEff') - stats.get('minEff')) + stats.get('minEff')),
            poids: Math.floor(Math.random() *  (stats.get('maxPoids') - stats.get('minPoids')) + stats.get('minPoids')),
            rarete: Math.floor(Math.random() * 11),
            nom: weaponName
        });
        updatedSamourai.patience = samourai[0].patience + 1 * (1+weapons.length/50);
        await Samourai.findByIdAndUpdate(updatedSamourai.id, updatedSamourai);
        return  "C'est en forgeant qu'on se fait des ampoules";
    }else{
        return "Vous n'avez pas de samourai"
    }
}

let UpdateWeapon = async (request, reply) => {
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
}

let DeleteWeaponByName = async (request, reply) => {
    const weapons = await Weapon.find({});
    if (weapons.filter(w=>w.nom == request.params.name).length) {
        await Weapon.deleteOne(weapons.filter(w=>w.nom == request.params.name)[0]);
        return "Vous jetez "+request.params.name+" dans la fonderie"
    } else {
        return "Vous n'avez pas d'armes"
    }
}

let DeleteWeaponEasier = async (request, reply) => {
    const weapons = await Weapon.find({});
    let kept = weapons[weapons.length - 1];
    let resp = ""
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
}

module.exports={
    ShowWeapons,
    CreateWeapon,
    UpdateWeapon,
    DeleteWeaponByName,
    DeleteWeaponEasier
}
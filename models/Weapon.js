const mongoose=require('mongoose');

const Weapon=new mongoose.Schema({
    efficacite: { type: Number, required: true },
    poids: { type: Number, required: true },
    rarete: { type: Number, required: true },
    nom: { type: String, required: true },
});

module.exports=mongoose.model('Weapon', Weapon);
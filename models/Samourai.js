const mongoose=require('mongoose');

const Samourai=new mongoose.Schema({
    force: { type: Number, required: true },
    determination: { type: Number, required: true },
    habilete: { type: Number, required: true },
    patience: { type: Number, required: true },
    sagesse: { type: Number, required: true },
});

module.exports=mongoose.model('Samourai', Samourai);
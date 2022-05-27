const Samourai=require('../models/Samourai');

let CreateOrShowSamourai = async(request, reply)=>{
    const samourai = await Samourai.find({});
    //Créer le samourai s'il n'existe pas
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
}

let UpdateSamourai = async (request, reply) => {
    const samourai = await Samourai.find({});
    let updatedSamourai = samourai[0];
    // Switch pour les routes
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
        return "Vous n'avez pas de samourai"
    }
}

module.exports={
    CreateOrShowSamourai,
    UpdateSamourai
}
const samouraiController=require('../controllers/SamouraiController')
const weaponController=require('../controllers/weaponController')

const routes=[
    {
        method: 'GET',
        url: '/',
        handler: async (request, reply) => {
            reply.redirect('/temple');
        }
    },
    {
        method: 'GET',
        url: '/temple',
        handler:samouraiController.CreateOrShowSamourai
    },
    {
        method: 'PUT',
        url: '/temple/:action',
        handler:samouraiController.UpdateSamourai
    },
    {
        method: 'GET',
        url: '/forge',
        handler:weaponController.ShowWeapons
    },
    {
        method: 'POST',
        url: '/forge/anvil',
        handler:weaponController.CreateWeapon
    },
    {
        method: 'PUT',
        url: '/forge/:tool/:name',
        handler:weaponController.UpdateWeapon
    },
    {
        method: 'DELETE',
        url: '/forge/melter/:name',
        handler:weaponController.DeleteWeaponByName
    },
    {
        method: 'DELETE',
        url: '/forge/:trash',
        handler:weaponController.DeleteWeaponEasier
    },
]

module.exports=routes;
const {Router} = require('express');
const {
    characters,
    characterByID,
    addCharacter,
    deleteCharacter,
    updateCharacter,
}=require('../controllers/users');

const router = Router();

// http://localhost:3000/api/v1/characters/id
router.get('/',characters); //READ
router.get('/:id',characterByID) //READ
router.put('/',addCharacter); //CREATE
router.patch('/:id',updateCharacter); //UPDATE
router.delete('/:id',deleteCharacter); // DELETE


module.exports=router; 
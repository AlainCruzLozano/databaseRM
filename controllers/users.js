const {request,response} = require('express');
const pool = require('../db');
const usersModel = require('../models/users');

//mostrar personajes
const characters= async(req = request,res=response)=>{
    let conn;
    try {
        conn = await pool.getConnection();
        
        const  users = await conn.query(usersModel.getAll,(err)=>{
            if(err){
                throw new Error(err);   
            }
        })

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

//mostrar personajes por id
const characterByID= async(req = request,res=response)=>{
    const{id}=req.params;

    if(isNaN(id)){
        res.status(400).json({msg:'Invalid ID'});
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        
        const [user] = await conn.query(usersModel.getByID,[id],(err)=>{  
            if(err){
                throw new Error(err);    
            }
        })

        if(!user){
            res.status(404).json({msg:'Character not found'});
            return;
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

//Añadir personaje nuevo
const addCharacter = async (req = request,res = response) =>{
    const {
        name,
        status,
        species,
        Gender
    } = req.body;

    if(!name || !status || !species || !Gender){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const user = [
        name,
        status,
        species,
        Gender
    ];

    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(
            usersModel.getByUsername,
            [name],
            (err) => {if (err) throw err;}
        );
        if(usernameUser) {
            res.status(409).json({msg:`Character with username ${name} alredy exist`});
            return;
        }

        
        const userAdded = await conn.query(
            usersModel.addRow, 
            [...user], 
            (err) => {if (err) throw err;}
        );
        
        if (userAdded.affectedRows === 0) throw new Error({msg: 'Failed to add Character'});

        res.json({msg: 'Character added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

//actualizar datos de personaje
const updateCharacter=async(req, res)=>{
    const {
        name,
        status,
        species,
        Gender
    } = req.body;

const {id} = req.params;


let newUserData=[
    name,
    status,
    species,
    Gender
];
let conn;
try{
    conn = await pool.getConnection();
const [userExists]=await conn.query(
    usersModel.getByID,
    [id],
    (err) => {if (err) throw err;}
);
if (!userExists || userExists.id_active === 0){
    res.status(404).json({msg:'Character not found'});
    return;
}

const [usernameUser] = await conn.query(
    usersModel.getByUsername,
    [name],
    (err) => {if (err) throw err;}
);
if (usernameUser){
    res.status(409).json({msg:`Character with username ${name} already exists`});
    return;
}

const oldUserData = [
    userExists.name,
    userExists.status,
    userExists.species,
    userExists.Gender
];

newUserData.forEach((userData, index)=> {
    if (!userData){
        newUserData[index] = oldUserData[index];
    }
})

const userUpdate = await conn.query(
    usersModel.updateRow,
    [...newUserData, id],
    (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
    throw new Error ('Character not updated');
}
res.json({msg:'Character updated successfully'})
}catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}


//borrar registro de personaje
const deleteCharacter = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {id} = req.params;

        const [userExists] = await conn.query(
            usersModel.getByID,
            [id],
            (err) => {if (err) throw err;}
        );

        if (!userExists|| userExists.is_active === 0){
            res.status(404).json({msg:'Character not found'});
            return;
        }

        const userDelete = await conn.query(
            usersModel.deleteRow,
            [id],
            (err) => {if (err) throw err;}
        );

        if (userDelete.affectedRows === 0) 
            throw new Error ({msg: 'Failed to delete Character'});

        res.json({msg: 'Character deleted succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error); 
    }finally{
        if (conn) conn.end();
    }
}


const signIn = async (req = request, res = response) => {
    
    let conn;
    const {username, password} = req.body;
    
    if (!username || !password ){
        res.status(400).json({msg: 'Username and Password are required'});
        return;
    }


    try {
    conn = await pool.getConnection();

    const [user] = await conn.query(
        usersModel.getByUsername, 
        [username],
        (err) => {if (err) throw err;}
    )

    if (!user || !user.is_active === 0 ){
        res.status(404).json({msg: 'Wrong username or password'});
        return;
    }

    const passwordOk = bcrypt.compare(password, user.password);
    if (!passwordOk){
        res.status(404).json({msg: 'Wrong username or password'});
        return;
    }

    delete user.password;
    delete user.created_at;
    delete user.updated_at;

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }

}

module.exports={
    characters,
    characterByID,
    addCharacter,
    deleteCharacter,
    updateCharacter
};
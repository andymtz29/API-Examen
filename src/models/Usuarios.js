import mongoose from "mongoose";

const CatalogoModelo = new mongoose.Schema({
    usuario:{type:"String",required:true},
    password:{type:"String",required:true},
    rol:{type:"String",required:true},
    estado:{type:"String",required:true}
},{
    collection : 'usuarios'
});

//identificador fuera del archivo, instancia de clase apartir de schema
export default mongoose.model('Usuarios',CatalogoModelo);
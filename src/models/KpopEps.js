import mongoose from "mongoose";

const CatalogoModelo = new mongoose.Schema({
    titulo:{type:String,required:true},
    artista_grupo:{type:String,required:true},
    año_lanzamiento:{type:Date,required:true},
    img:{type:String,required:true}
},{
    collection : 'eps'
});

//identificador fuera del archivo, instancia de clase apartir de schema
export default mongoose.model('Eps',CatalogoModelo);
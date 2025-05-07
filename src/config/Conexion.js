import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const Conexion = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10, //numero maximo de conexions
            minPoolSize: 5  //numero minimo de conexiones
        });
        console.log('✅ Conectando a Mongo con Pooling');
    }catch(error) {
        console.log(' Error en la conexion a MongoDb:', error.message);
        process.exit(1);
    }
}

export default  Conexion;
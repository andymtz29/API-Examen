import Usuario from "../models/Usuarios.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const registro_usuario = async (recibido, respuesta) => {
    try{
        const {usuario,password,rol} = recibido.body;
        const cifrado = await bcrypt.hash(password,10);
        const registro = new Usuario({"usuario":usuario,"password":cifrado, "rol":rol, "estado":0 });
        await registro.save();
        respuesta.status(201).json({"msj":"Usuario registrado", "registro":registro})
    }catch(error){
        respuesta.status(500).json({"msj":error.msj});
    }

}

const iniciar_sesion = async (recibido,respuesta) => {
    try{
        const {usuario,password} = recibido.body;
        const consultaUsuario = await Usuario.findOne({"usuario":usuario});
        if (!consultaUsuario) return respuesta.status(500).json({"msj": `El usuario ${usuario} no esta registrado!`})
        
        let comparacion = await bcrypt.compare(password,consultaUsuario.password);

        if(!comparacion) return respuesta.status(500).json({"msj":"Credenciales no acceso no validas!"})
        
        const token = jwt.sign({
            id:consultaUsuario._id,
            "rol":consultaUsuario.rol

             },process.env.JWT_SECRET,
             {
                "expiresIn":"1hr"
                
             });

        respuesta.status(201).json({"msj":"Inicio de sesion exitoso", "token":token})
    }catch(error){
        respuesta.status(500).json({"msj":error.msj})
    }
}
export {registro_usuario, iniciar_sesion};


























// const consultaUsuarios = async (recibido, respuesta) => {
//     try {
//         const usuarios = await Usuario.find();
//         if (usuarios.length === 0) {
//             return respuesta.status(404).json({ estatus: "error", msj: "No se encontraron usuarios" });
//         }
//         respuesta.json(usuarios);
//     } catch (error) {
//         respuesta.status(500).json({ error: error.message });
//     }
// };

// const consulta_individual_Usuario = async (recibido, respuesta) => {
//     try {
//         const nombreUsuario = recibido.params.usuario;
//         const usuario = await Usuario.findOne({ usuario: nombreUsuario });

//         if (!usuario) {
//             return respuesta.status(404).json({ mensaje: `Usuario '${nombreUsuario}' no encontrado` });
//         }
//         respuesta.json(usuario);
//     } catch (error) {
//         respuesta.status(500).json({ error: error.message });
//     }
// };

// const insercion_Usuario = async (recibido, respuesta) => {
//     try {
//         const { usuario, password, rol, estado } = recibido.body;

//         if (!usuario || !password || !rol || typeof estado === 'undefined') {
//             return respuesta.status(400).json({ error: "Todos los campos (usuario, password, rol, estado) son obligatorios." });
//         }

//         const usuarioExistente = await Usuario.findOne({ usuario });
//         if (usuarioExistente) {
//             return respuesta.status(400).json({ error: "El nombre de usuario ya existe." });
//         }

//         const nuevoUsuario = new Usuario({ usuario, password, rol, estado });
//         await nuevoUsuario.save();

//         respuesta.status(201).json({ mensaje: "Usuario agregado correctamente", usuario: nuevoUsuario });
//     } catch (error) {
//         respuesta.status(500).json({ error: error.message });
//     }
// };

// const actualizar_Usuario = async (recibido, respuesta) => {
//     try {
//         const usuarioParam = recibido.params.usuario;
//         const { usuario, password, rol, estado } = recibido.body;

//         if (!usuario || !password || !rol || typeof estado === 'undefined') {
//             return respuesta.status(400).json({ error: "Todos los campos (usuario, password, rol, estado) son obligatorios." });
//         }

//         const usuarioExistente = await Usuario.findOne({ usuario: usuarioParam });

//         if (usuarioExistente) {
//             await Usuario.updateOne(
//                 { usuario: usuarioParam },
//                 { $set: { usuario, password, rol, estado } }
//             );

//             return respuesta.status(200).json({
//                 mensaje: "Usuario actualizado correctamente",
//                 usuarioActualizado: { usuario, password, rol, estado }
//             });
//         } else {
//             const nuevoUsuario = new Usuario({ usuario, password, rol, estado });
//             await nuevoUsuario.save();

//             return respuesta.status(201).json({
//                 mensaje: "Usuario no encontrado. Se creó un nuevo registro.",
//                 usuarioNuevo: nuevoUsuario
//             });
//         }
//     } catch (error) {
//         respuesta.status(500).json({ error: error.message });
//     }
// };

// const eliminar_Usuario = async (recibido, respuesta) => {
//     try {
//         const nombreUsuario = recibido.params.usuario;
//         const resultado = await Usuario.deleteOne({ usuario: nombreUsuario });

//         if (resultado.deletedCount === 0) {
//             return respuesta.status(404).json({ mensaje: `Usuario '${nombreUsuario}' no encontrado.` });
//         }

//         respuesta.status(200).json({ mensaje: "Usuario eliminado correctamente" });
//     } catch (error) {
//         respuesta.status(500).json({ error: error.message });
//     }
// };

// export {consultaUsuarios, consulta_individual_Usuario, insercion_Usuario, actualizar_Usuario, eliminar_Usuario};
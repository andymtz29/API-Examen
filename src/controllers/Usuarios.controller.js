import Usuario from "../models/Usuarios.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import Usuarios from "../models/Usuarios.js";

const consultaUsuario = async (recibido, respuesta) => {
    try {
        const usuarios = await Usuarios.find();
        if (usuarios.length === 0) {
            return respuesta.status(404).json({estatus: "error",msj: "No e encontraron usuarios"});
        }
        respuesta.json(usuarios);
    }catch (error) {
        respuesta.status(500).json({error: error.message});
    }
}



const registro_usuario = async (recibido, respuesta) => {
    try {
        const {usuario, password, } = recibido.body;
        const cifrado = await bcrypt.hash(password,10)
        const registro = new Usuarios({"usuario":usuario, "password": cifrado, "rol": "2", "estado": 0});
        await registro.save();
        respuesta.status(201).json({"msj":"Usuario registrado", "registro":registro})
    } catch(error) {
        respuesta.status(500).json({"msj": error.msj})
    }
}


const editar_usuario = async (recibido, respuesta) => {
    try {
        if (respuesta.user.rol !== "2") {
            return respuesta.status(403).json({ msj: "No tienes permisos para efectuar esta acción" });
        }

        const nombreActual = recibido.params.nombreUsuario;
        const { rol, estado } = recibido.body;

        if (!rol || !estado) {
            return respuesta.status(400).json({ error: "Los campos 'rol' y 'estado' son obligatorios" });
        }

        const resultado = await Usuarios.updateOne(
            { usuario: nombreActual },
            { $set: { rol, estado } }
        );

        if (resultado.matchedCount === 0) {
            return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        return respuesta.status(200).json({ mensaje: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error("Error en editar_usuario", error);
        respuesta.status(500).json({ error: error.message });
    }
};

 const eliminar_usuario = async (recibido,respuesta)=> {
    try {
        if(respuesta.user.rol !== "2") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const nombreUsuario = recibido.params.nombreUsuario;
        const resultado = await Usuarios.deleteOne({usuario: nombreUsuario});
        if (resultado.deletedCount === 0) {
            return respuesta.status(404).json({mensaje: `Usuario${nombreUsuario} no encontardo`});
        }
        respuesta.status(200).json({mensaje: "Usuario eliminado correctamente"});
    } catch( error) {
        console.error("error en actualizar usuario", error);
        respuesta.status(500).json({error: error.message});
        
    }
 }

const iniciar_sesion = async (recibido, respuesta) => {
    try {
        const { usuario, password } = recibido.body;
        const consultaUsuario = await Usuario.findOne({ "usuario": usuario });

        if (!consultaUsuario) {
            return respuesta.status(500).json({ "msj": `El usuario ${usuario} no está registrado!` });
        }

        if (consultaUsuario.estado === 'Inabilitado') {
            return respuesta.status(500).json({ "msj": "Tu cuenta ha sido deshabilitada" });
        }

        const comparacion = await bcrypt.compare(password, consultaUsuario.password);
        if (!comparacion) {
            return respuesta.status(500).json({ "msj": "Credenciales de acceso no válidas!" });
        }

        // Cambiar el estado a Activo si está Inactivo
        if (consultaUsuario.estado === 'Inactivo') {
            consultaUsuario.estado = 'Activo';
            await consultaUsuario.save(); // Guarda el cambio en la base de datos
        }

        const token = jwt.sign(
            {
                "id": consultaUsuario._id,
                "rol": consultaUsuario.rol
            },
            process.env.JWT_SECRET,
            {
                "expiresIn": "1h"
            }
        );

        respuesta.status(200).json({
            "msj": "Inicio de Sesión exitoso",
            "token": token,
            "usuario": consultaUsuario.usuario,
            "datos": consultaUsuario
        });

    } catch (error) {
        respuesta.status(500).json({ "msj": error.message });
    }
}
const cerrar_sesion = async (recibido, respuesta) => {
    try {
        const { usuario } = recibido.body;
        const consultaUsuario = await Usuario.findOne({ "usuario": usuario });

        if (!consultaUsuario) {
            return respuesta.status(404).json({ "msj": `El usuario ${usuario} no fue encontrado` });
        }

        // Cambiar a Inactivo si está Activo
        if (consultaUsuario.estado === 'Activo') {
            consultaUsuario.estado = 'Inactivo';
            await consultaUsuario.save();
        }

        respuesta.status(200).json({ "msj": "Sesión cerrada correctamente, usuario ahora está Inactivo." });
    } catch (error) {
        respuesta.status(500).json({ "msj": error.message });
    }
}



export {registro_usuario, iniciar_sesion, consultaUsuario, editar_usuario, eliminar_usuario, cerrar_sesion};
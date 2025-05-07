import Eps from "../models/KpopEps.js";


const consultaEps = async (recibido, respuesta) => {
    try {
        const eps = await Eps.find();
        if (eps.length === 0) {
            return respuesta.status(404).json({
                estatus: "error 1",
                msj: "No se encontraron eps en la BD"
            });
        }
        respuesta.json(eps);
    } catch (error) {
        respuesta.status(500).json({ "error": error.message });
    }
};

const consulta_individual_Eps = async (recibido, respuesta) => {
    try {
        const tituloEps = recibido.params.tituloEps;
        const eps = await Eps.findOne({ titulo: tituloEps });

        if (!eps) {
            return respuesta.status(404).json({ mensaje: `Eps '${tituloEps}' no existente` });
        }
        respuesta.json(eps);
    } catch (error) {
        respuesta.status(500).json({ "error": error });
    }
};

const insercion_Eps = async (recibido, respuesta) => {
    try {
        if(respuesta.user.rol !== "2") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const { titulo, artista_grupo, año_lanzamiento, img } = recibido.body;

        if (!titulo || !artista_grupo || !año_lanzamiento || !img) {
            return respuesta.status(400).json({ error: "Todos los campos (titulo, artista_grupo, año_lanzamiento, img) son obligatorios." });
        }

        const nuevoEps = new Eps({
            titulo,
            artista_grupo,
            año_lanzamiento: new Date(año_lanzamiento),
            img: img || ""
        });

        await nuevoEps.save();

        respuesta.status(201).json({
            mensaje: "Eps de Kpop agregado correctamente",
            eps: nuevoEps
        });
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
};

const actualizar_Eps = async (recibido, respuesta) => {
    try {
        if(respuesta.user.rol !== "2") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const tituloActual = recibido.params.tituloEps;
        const { titulo, artista_grupo, año_lanzamiento, img } = recibido.body;

        const epsExistente = await Eps.findOne({ titulo: tituloActual });

        if (epsExistente) {
            await Eps.updateOne(
                { titulo: tituloActual },
                {
                    $set: {
                        titulo,
                        artista_grupo,
                        año_lanzamiento: new Date(año_lanzamiento),
                        img
                    }
                }
            );
            return respuesta.status(200).json({ mensaje: "Eps actualizado correctamente" });
        } else {
            const nuevoEps = new Eps({
                titulo,
                artista_grupo,
                año_lanzamiento: new Date(año_lanzamiento),
                img
            });

            await nuevoEps.save();

            return respuesta.status(201).json({
                mensaje: "Eps no encontrado. Se creó un nuevo registro.",
                epsNuevo: nuevoEps
            });
        }
    } catch (error) {
        respuesta.status(500).json({
            error: "Error al actualizar o insertar eps.",
            detalle: error.message
        });
    }
};

const eliminar_Eps = async (recibido, respuesta) => {
    try {
        if(respuesta.user.rol !== "2") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const tituloEps = recibido.params.tituloEps;

        const resultado = await Eps.deleteOne({ titulo: tituloEps });

        if (resultado.deletedCount === 0) {
            return respuesta.status(404).json({ mensaje: `Eps '${tituloEps}' no encontrado.` });
        }

        respuesta.status(200).json({ mensaje: "Eps eliminado correctamente" });
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
};

export { consultaEps, consulta_individual_Eps, insercion_Eps, actualizar_Eps, eliminar_Eps };

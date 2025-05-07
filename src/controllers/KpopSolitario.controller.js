import Solitario from "../models/kpopSolitario.js";

const consultaSolitario = async (recibido, respuesta) => {
    try {
        const albums = await Solitario.find();
        if (albums.length === 0) {
            return respuesta.status(404).json({ estatus: "error", msj: "No se encontraron álbumes de solitario" });
        }
        respuesta.json(albums);
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
};

const consulta_individual_Solitario = async (recibido, respuesta) => {
    try {
        const tituloAlbum = recibido.params.tituloAlbum;
        const album = await Solitario.findOne({ titulo: tituloAlbum });

        if (!album) {
            return respuesta.status(404).json({ mensaje: `Álbum '${tituloAlbum}' no existente` });
        }
        respuesta.json(album);
    } catch (error) {
        respuesta.status(500).json({ error });
    }
};

const insercion_Solitario = async (recibido, respuesta) => {
    try {
        if(respuesta.user.rol !== "2") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const { titulo, artista_grupo, año_lanzamiento, img } = recibido.body;

        if (!titulo || !artista_grupo || !año_lanzamiento || !img) {
            return respuesta.status(400).json({ error: "Todos los campos (titulo, artista_grupo, año_lanzamiento, img) son obligatorios." });
        }
        
        const nuevoAlbum = new Solitario({
            titulo,
            artista_grupo,
            año_lanzamiento: new Date(año_lanzamiento),
            img: img || ""
        });

        await nuevoAlbum.save();
        respuesta.status(201).json({ mensaje: "Álbum de solitario agregado", album: nuevoAlbum });
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
};

const actualizar_Solitario = async (recibido, respuesta) => {
    try {
        if(respuesta.user.rol !== "2") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const tituloActual = recibido.params.tituloAlbum;
        const { titulo, artista_grupo, año_lanzamiento, img } = recibido.body;

        if (!titulo || !artista_grupo || !año_lanzamiento || !img) {
            return respuesta.status(400).json({ error: "Todos los campos (titulo, artista_grupo, año_lanzamiento, img) son obligatorios." });
        }

        const albumExistente = await Solitario.findOne({ titulo: tituloActual });

        if (albumExistente) {
            await Solitario.updateOne(
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

            return respuesta.status(200).json({ mensaje: "Álbum actualizado correctamente" });
        } else {
            const nuevoAlbum = new Solitario({
                titulo,
                artista_grupo,
                año_lanzamiento: new Date(año_lanzamiento),
                img
            });
            await nuevoAlbum.save();
            return respuesta.status(201).json({ mensaje: "Álbum no encontrado. Se creó nuevo", albumNuevo: nuevoAlbum });
        }
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
};

const eliminar_Solitario = async (recibido, respuesta) => {
    try {
        if(respuesta.user.rol !== "2") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const tituloAlbum = recibido.params.tituloAlbum;
        const resultado = await Solitario.deleteOne({ titulo: tituloAlbum });

        if (resultado.deletedCount === 0) {
            return respuesta.status(404).json({ mensaje: `Álbum '${tituloAlbum}' no encontrado.` });
        }

        respuesta.status(200).json({ mensaje: "Álbum eliminado correctamente" });
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
};

export { consultaSolitario, consulta_individual_Solitario, insercion_Solitario, actualizar_Solitario, eliminar_Solitario };

import { Router } from 'express';

// Controladores de cada genero
import { consultaEps, consulta_individual_Eps, insercion_Eps, actualizar_Eps, eliminar_Eps  } from '../controllers/KpopEPs.controller.js';
import { consultaSolitario, consulta_individual_Solitario, insercion_Solitario, actualizar_Solitario, eliminar_Solitario  } from '../controllers/KpopSolitario.controller.js';
import {iniciar_sesion, registro_usuario, consultaUsuario, editar_usuario, eliminar_usuario, cerrar_sesion} from '../controllers/Usuarios.controller.js'
import authMiddleware from '../config/authMiddleware.js'; 
import uploads from '../config/archivosConfig.js';
import {cargar_imagen, eliminar_imagen} from '../controllers/Archivo.controller.js';
import fs from 'fs';
import path from 'path';
const router = Router();


//archivos
router.post("/subir",uploads.single('imagen'),cargar_imagen);
router.delete("/eliminar/:nombre",eliminar_imagen);
// Ruta para listar imágenes existentes en la carpeta uploads
router.get("/imagenes", (req, res) => {
  const directorio = path.join(process.cwd(), 'uploads');

  fs.readdir(directorio, (err, archivos) => {
    if (err) {
      return res.status(500).json({ estatus: "error", msj: "Error al leer la carpeta" });
    }

    const imagenes = archivos.filter(nombre =>
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(nombre).toLowerCase())
    );

    res.json(imagenes);
  });
});

// 🎶 Eps de Kpop
router.get("/eps", consultaEps);
router.get("/eps/:tituloEps", consulta_individual_Eps);
router.post("/eps/insercion",authMiddleware, insercion_Eps);
router.put("/eps/actualizar/:tituloEps",authMiddleware, actualizar_Eps);
router.delete("/eps/eliminar/:tituloEps",authMiddleware, eliminar_Eps);

router.get("/solitario", consultaSolitario);
router.get("/solitario/:tituloAlbum",consulta_individual_Solitario);
router.post("/solitario/insercion",authMiddleware, insercion_Solitario);
router.put("/solitario/actualizar/:tituloAlbum",authMiddleware, actualizar_Solitario);
router.delete("/solitario/eliminar/:tituloAlbum",authMiddleware, eliminar_Solitario);
// 👨‍💻 Usuarios


router.post("/registro",registro_usuario)
router.post("/login", iniciar_sesion)
router.get("/usuarios", consultaUsuario);
router.post("/cerrar", cerrar_sesion)
router.put("/usuarios/actualizar/:nombreUsuario", authMiddleware, editar_usuario);
router.delete("/usuarios/eliminar/:nombreUsuario", authMiddleware, eliminar_usuario);





export default router;

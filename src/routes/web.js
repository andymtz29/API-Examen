import { Router } from 'express';

// Controladores de cada genero
// import { consultaAlbum, consulta_individual_Album, insercion_Album, actualizar_Album, eliminar_Album  } from '../controllers/KpopAlbum.controller.js';
import { consultaEps, consulta_individual_Eps, insercion_Eps, actualizar_Eps, eliminar_Eps  } from '../controllers/KpopEPs.controller.js';
import { consultaSolitario, consulta_individual_Solitario, insercion_Solitario, actualizar_Solitario, eliminar_Solitario  } from '../controllers/KpopSolitario.controller.js';
import {iniciar_sesion, registro_usuario} from '../controllers/Usuarios.controller.js'

// import { consultaUsuarios, consulta_individual_Usuario, insercion_Usuario, actualizar_Usuario, eliminar_Usuario, registro_usuario } from "../controllers/Usuarios.controller.js";

const router = Router();

import authMiddleware from '../config/authMiddleware.js'; 



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
// router.get("/usuarios", consultaUsuarios);
// router.get("/usuarios/:usuario", consulta_individual_Usuario);
// router.post("/usuarios/insercion", insercion_Usuario);
// router.put("/usuarios/actualizar/:usuario", actualizar_Usuario);
// router.delete("/usuarios/eliminar/:usuario", eliminar_Usuario);


// router.get("/albumes", consultaAlbum);
// router.get("/albumes/:tituloAlbum", consulta_individual_Album);+
// router.post("/albumes/insercion", insercion_Album);
// router.put("/albumes/actualizar/:tituloAlbum", actualizar_Album);
// router.delete("/albumes/eliminar/:tituloAlbum", eliminar_Album);6 

export default router;

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Para obtener el __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extensiones válidas
const extencionesImagen = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Ajuste importante
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // FIX: Date.now()
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (extencionesImagen.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo imágenes (.jpg, .jpeg, .png, .gif, .webp)'), false);
    }
};

const limits = { fileSize: 3 * 1024 * 1024 }; // 3 MB

const uploads = multer({ storage, fileFilter, limits });

export default uploads;
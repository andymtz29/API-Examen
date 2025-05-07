import jwt from"jsonwebtoken";

const authMiddleware = (recibido, respuesta, next) => {
    const token = recibido.header("Autorizacion");
    try{
        if(!token) return respuesta.status(500).json({"msj":"Se ha generado un error, no se ha generado un token"});
        const decodificado =jwt.verify(token.replace("Back ", ""), process.env.JWT_SECRET);

        if(!decodificado) return respuesta.status(500).json({"msj":"El token proporcionado no es valido"});

        respuesta.user = decodificado;
        next();

    }catch(error){ 

        respuesta.status(500).json({"msj":"Se ha generado un error en el servidor"});
    }
}

export default authMiddleware;
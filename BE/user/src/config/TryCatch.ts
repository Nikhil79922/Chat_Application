import { RequestHandler,Request,Response, NextFunction } from "express";

const TryCatch= (handle: RequestHandler) =>{
    return async(req:Request, res:Response, next:NextFunction)=>{
        try {
            await handle(req,res,next);
        } catch (error:any) {
            res.status(500).json({
                message:error.message,
            })
        }
    }
}

export default TryCatch;
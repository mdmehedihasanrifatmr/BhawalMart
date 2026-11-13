import AppError from "../utils/AppError.js";

const adminOnly = async(req, res, next)=>{
    if(!req.user){
        throw new AppError("Authentication required",401);
    }
    if(req.user.role!="admin"||req.user.isEmailVerified!=true){
        throw new AppError("Access denied",403);
    }
    next();
}
export default adminOnly;
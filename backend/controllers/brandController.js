import { createBrand, getBrandById, getBrands } from "../services/brandService.js";

export const createBrandController = async(req,res,next)=>{
    try{
        const brand = await createBrand(req.body);

        res.status(201).json({success:true,message:"Brand created successfully",data:brand});
    }catch(e){
        next(e);
    }
}

export const getBrandsController = async(req,res,next)=>{
    try{
        const brands = await getBrands();
        res.status(200).json({success:true,message:"All the brands",data:brands});
    }catch(e){
        next(e);
    }
}

export const getBrandByIdController = async(req,res,next)=>{
    try{
        const brand = await getBrandById(req.params.brandId);
        res.status(200).json({success:true,message:"Brand",data:brand});
    }catch(e){
        next(e);
    }
}
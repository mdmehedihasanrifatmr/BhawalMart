import Brand from "../models/Brand.js";
import AppError from "../utils/AppError.js";

export const createBrand = async(brandData)=>{
    const {name,slug}= brandData;

    const existingBrand = await Brand.findOne({$or:[{name},{slug}]});

    if(existingBrand){
        throw new AppError("Brand name or slug already",409);
    }

    const brand = await Brand.create({name,slug});

    return brand;
}

export const getBrands = async()=>{
    const brands = await Brand.find();
    return brands;
}

export const getBrandById = async(brandId)=>{
    const brand = await Brand.findById(brandId);

    if(!brand){
        throw new AppError("Brand not found",404);
    }

    return brand;
}

export const updateBrand = async(brandId,updateData)=>{
    
}
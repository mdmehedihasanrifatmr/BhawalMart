
export const createProduct= async(req,res)=>{
    const result = createProductService(req.body);
    res.status(201).json({success:true,message:"Product Created Successfully"});
}

export const getProducts = async(req , res )=>{

}

export const getProductById = async(req, res)=>{

}

export const updateProductById = async(req,res)=>{

}

export const deleteProductById = async(req,res)=>{

}
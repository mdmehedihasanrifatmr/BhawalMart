
export const createProductService = async(productData)=>{
    const {name,description,price,stock,category,imageUrl,rating,review}=productData;
    console.log(name,description,price,stock,category,imageUrl,rating,review);
    return{
        name
    }
}
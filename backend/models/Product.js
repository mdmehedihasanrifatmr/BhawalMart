import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true
    },
    price:{
        type:Number,
        default:0,
        required:true
    },
    stock:{
        type:Number,
        default:0,
    },
    category:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        trim:true
    },
    rating:{
        type:Number,
        default:0,
    },
    review:{
        type:String,
    }

},{
    timestamps:true,
});

const Product = mongoose.model("Product",productSchema);
export default Product;
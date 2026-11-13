import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    attributes: {
      type: Map,
      of: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

productVariantSchema.index({ product: 1 });

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

export default ProductVariant;

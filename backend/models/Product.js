import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
      validate: {
        validator: function (value) {
          return value == null || value < this.price;
        },
        message: "Discount price must be lower than regular price.",
      },
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },

        alt: {
          type: String,
          default: "",
        },

        isPrimary: {
          type: Boolean,
          default: false,
        },

        sortOrder: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],

    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;

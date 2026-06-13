import mongoose from "mongoose";
const GallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        imageUrl: {
            type: String,
            required: true,
        },

            mediaType: {
                type: String,
                enum: ["image", "video"],
                default: "image", 
            },
    },

    {
        timestamps: true,
    }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
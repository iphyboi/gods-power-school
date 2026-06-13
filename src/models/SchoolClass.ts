import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
    {
        name: String,
        fee: Number,
    },

    {
        timestamps: true,
    }
);

const SchoolClass = mongoose.models.SchoolClass || mongoose.model("SchoolClass", ClassSchema);
export default SchoolClass;
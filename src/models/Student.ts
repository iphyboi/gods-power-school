import mongoose, {
    Schema,
    models,
    model,
} from "mongoose";

const StudentSchema = new Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
        },
        
        fullName: {
            type: String,
            required: true,
        },

        gender: {
            type: String,
            required: true,
        },

        class: {
            type: String,
            required: true,
        },

        department: {
            type: String,
            default: "",
        },

        session: {
            type: String,
            required: true,
        },

        dateOfBirth: {
            type: String,
        },

        parentName: {
            type: String,
        },

        parentPhone: {
            type: String,
        },

        address: {
            type: String,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },

    {
         timestamps: true,
        }
);

const Student = models.Student || model("Student", StudentSchema);
export default Student;

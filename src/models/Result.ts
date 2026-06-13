import mongoose, {
    Schema,
    models,
    model,
} from "mongoose";

const SubjectSchema = new Schema({
    subjectName: {
        type: String,
        required: true,
    },

    ca: {
        type: Number,
        required: true,
    },

    exam: {
        type: String,
        required: true,
    },

    total: {
        type: Number,
        required: true,
    },

    grade: {
        type: String,
        required: true,
    },
});

const ResultSchema = new Schema(
    {
        studentName: {
            type: String,
            required: true,
        },

        studentId: {
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

        term: {
            type: String,
            required: true,
        },

        session: {
            type: String,
            required: true,
        },

        subjects: [SubjectSchema],

        grandTotal: {
            type: Number,
            default: 0,
        },

        average: {
            type: Number,
            default: 0,
        },
    },

    {
        timestamps: true,
    }
);

const Result = models.Result || model("Result", ResultSchema);
export default Result;
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        receiptUrl: {
            type: String,
            default: "",
        },

        totalFee: {
            type: Number,
            required: true,
        },

        session: {
            type: String,
            required: true,
        },

        term: {
            type: String,
            required: true,
        },

        amountPaid: {
            type: Number,
            required: true,
        },

        balance: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Paid",
                "Part Payment",
                "Unpaid",
            ],

            required: true,
        },

        paymentMethod: {
            type: String,
            default: "Manual",
        },
    },

    {
        timestamps: true,
    }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
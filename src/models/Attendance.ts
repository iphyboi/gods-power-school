import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Late"],
            required: true,
        },
        remarks: {
            type: String,
            default: "",
        },
    },
{ timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
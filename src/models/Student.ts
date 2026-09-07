import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const AcademicHistorySchema = new Schema(
  {
    session: {
      type: String,
      required: true,
    },

    class: {
      type: String,
      required: true,
    },

    stream: {
      type: String,
      default: "General",
    },

    totalFee: {
      type: Number,
      default: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    balance: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Paid", "Part Payment", "Unpaid"],
      default: "Unpaid",
    },

    promotionStatus: {
      type: String,
      enum: [
        "Promoted",
        "Graduated",
        "Repeated",
        "Completed",
      ],
      default: "Promoted",
    },

    promotedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const StudentSchema = new Schema(
  {
    // ==========================================
    // UNIQUE STUDENT IDENTIFICATION
    // ==========================================

    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      trim: true,
    },

    // CURRENT CLASS
    class: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // ACADEMIC STREAM
    // ==========================================

    // General = Junior section
    // Science / Arts / Commercial = Senior section

    stream: {
      type: String,
      default: "General",
      trim: true,
    },

    // Keep department for compatibility
    // with existing records.

    department: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // CURRENT ACADEMIC SESSION
    // ==========================================

    session: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // CURRENT PAYMENT INFORMATION
    // ==========================================

    totalFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Paid",
        "Part Payment",
        "Unpaid",
      ],
      default: "Unpaid",
    },

    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    dateOfBirth: {
      type: String,
      default: "",
    },

    parentName: {
      type: String,
      default: "",
      trim: true,
    },

    parentPhone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // ACADEMIC HISTORY
    // ==========================================
    //
    // This stores the student's previous
    // classes and academic sessions.
    //
    // Example:
    //
    // 2025/2026 - JSS1
    // 2026/2027 - JSS2
    // 2027/2028 - JSS3
    //
    // The studentId NEVER changes.
    //

    academicHistory: {
      type: [AcademicHistorySchema],
      default: [],
    },

    // ==========================================
    // STUDENT STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student =
  models.Student ||
  model("Student", StudentSchema);

export default Student;
import mongoose, { Schema, models, model} from "mongoose";

const AnnouncementSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        audience: {
            type: String,
            enum: ["all", "students", "teachers", "parents"],
            default: "all",
        },

        published: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Announcement = models.Announcement || model("Announcement", AnnouncementSchema);
export default Announcement;
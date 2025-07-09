const { Schema, default: mongoose } = require("mongoose");

const orgchartSchema = new Schema(
    {
        imageKey: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: false,
        },
        json: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

const Orgchart = mongoose.model("OrgChart", orgchartSchema);
module.exports = Orgchart;

const path = require("path");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler");
const OrgChart = require("../models/orgchart.model.js");
const uploadOnCloudinary = require("../services/cloudinary.js");
// Path to users file
const { STATUS_CODES } = require("../utils/constants.js");
const { extractHierarchyFromImage } = require("../services/openai.js");
const { convertPdfToImage } = require("../utils/convertPdfToImg.js");

// @desc upload org chart JSON file
// @route POST /user/fetch-json
const fetchOrgChartJsonController = asyncHandler(async (req, res) => {
    let filePathLocal = req.file.path;
    const key = req.file.filename;
    // res.status(STATUS_CODES.OK).json(
    //     new ApiResponse(
    //         STATUS_CODES.OK,
    //         "Org chart JSON file fetched successfully",
    //         { "hello": "world" }
    //     )
    // );
    if (key.slice(-4) == ".pdf")
        filePathLocal = await convertPdfToImage(filePathLocal);

    if (!filePathLocal)
        throw new ApiError(STATUS_CODES.BAD_REQUEST, "Image file is missing");
    const file = await uploadOnCloudinary(filePathLocal);
    if (!file)
        throw new ApiError(
            STATUS_CODES.BAD_REQUEST,
            "Error while uploading Image."
        );

    const extractedData = await extractHierarchyFromImage(file?.url);
    const jsonObject = parseOrgChartResponse(extractedData);
    if (!jsonObject) {
        throw new ApiError(
            STATUS_CODES.BAD_REQUEST,
            "Failed to parse org chart data"
        );
    }
    const jsonString = JSON.stringify(jsonObject);
    await OrgChart.create({
        imageKey: key,
        json: jsonString,
        imageUrl: file?.url || "",
    }).then((orgChart) => {
        console.log("Org chart created:", orgChart);
    }).catch((error) => {
        console.error("Error creating org chart:", error);
        throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to create org chart");
    });

    console.log("Extracted Data:", jsonObject);
    res.status(STATUS_CODES.OK).json(
        new ApiResponse(
            STATUS_CODES.OK,
            "Org chart JSON file fetched successfully",
            jsonObject
        )
    );
});

function parseOrgChartResponse(responseString) {
    // Remove code block formatting
    const cleaned = responseString
        .replace(/```(javascript)?/g, "")   // remove ```javascript
        .replace(/```/g, "")                // remove trailing ```
        .replace(/\\n/g, "\n")              // fix escaped newlines
        .replace(/\\'/g, "'")               // fix escaped single quotes
        .trim();

    // Safely evaluate the JS object (recommended only if from trusted source)
    try {
        // Wrap in parentheses to ensure valid object expression
        const orgChartData = eval(`(${cleaned})`);
        return orgChartData;
    } catch (err) {
        console.error("❌ Failed to parse orgChartData:", err.message);
        return null;
    }
}


const saveOrgChartDataController = asyncHandler(async (req, res) => {
    const { json, imageKey, imageUrl } = req.body;
    if (!json || !imageKey || !imageUrl) {
        throw new ApiError(STATUS_CODES.BAD_REQUEST, "Missing required fields");
    }
    const jsonString = JSON.stringify(json);
    const orgChart = await OrgChart.create({
        json: jsonString,
        imageKey,
        imageUrl
    })

    if (!orgChart) {
        console.error("Error creating org chart:");
        throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to create org chart");
    }
    res.status(STATUS_CODES.OK).json(
        new ApiResponse(
            STATUS_CODES.OK,
            "Org chart data saved successfully",
            orgChart
        )
    )
});

module.exports = {
    fetchOrgChartJsonController,
    saveOrgChartDataController
};

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
    res.status(200).json({
        "statusCode": 200,
        "message": "Org chart JSON file fetched successfully",
        "data": {
            "name": "Bluefield Solar Income Fund Ltd",
            "children": [
                {
                    "name": "Bluefield Renewables 1 Ltd",
                    "children": [
                        {
                            "name": "New Road Wind Ltd"
                        },
                        {
                            "name": "New Road Solar Ltd",
                            "children": [
                                {
                                    "name": "Lower Mays Solar Farm Limited"
                                },
                                {
                                    "name": "Marshall Farm Energy Park Ltd"
                                },
                                {
                                    "name": "Alcocks GT Solar Ltd (Grazing Farm)"
                                },
                                {
                                    "name": "HW Solar Farm Ltd"
                                },
                                {
                                    "name": "Alcocks Bolt Solar Farm Ltd"
                                },
                                {
                                    "name": "Lightning Farm Energy Park Ltd"
                                },
                                {
                                    "name": "Whitehouse Farm Energy Barn Limited"
                                },
                                {
                                    "name": "Sheepwash Lane Energy Barn Limited"
                                },
                                {
                                    "name": "BPoD BIF Solar Ltd (Clock House Farm)"
                                },
                                {
                                    "name": "Petherbridge Solar Farm Ltd"
                                },
                                {
                                    "name": "New Road 2 Solar Ltd",
                                    "children": [
                                        {
                                            "name": "Longstone Solar Farm Limited"
                                        },
                                        {
                                            "name": "Lower Town Leys Solar Farm Ltd"
                                        },
                                        {
                                            "name": "Wallace Wood Solar Farm Ltd"
                                        },
                                        {
                                            "name": "Twineham Energy Ltd"
                                        },
                                        {
                                            "name": "Levening Solar Farm Ltd"
                                        },
                                        {
                                            "name": "Street Barns Solar Farm Ltd"
                                        },
                                        {
                                            "name": "LH DNO Grid Services Ltd"
                                        },
                                        {
                                            "name": "LH DNO Energy Park Ltd"
                                        },
                                        {
                                            "name": "Opium Solar Farm Ltd",
                                            "children": [
                                                {
                                                    "name": "Barville Solar Farm Ltd"
                                                },
                                                {
                                                    "name": "Curst Farm Solar Ltd"
                                                },
                                                {
                                                    "name": "Place Barton Farm Solar Park Ltd"
                                                },
                                                {
                                                    "name": "Old Stone Farm Solar Park Ltd"
                                                },
                                                {
                                                    "name": "Holly Farm Solar Park"
                                                },
                                                {
                                                    "name": "East Farm Solar Park"
                                                },
                                                {
                                                    "name": "Gatton Manor Solar Park Ltd"
                                                },
                                                {
                                                    "name": "Wormit Solar Farm Ltd"
                                                },
                                                {
                                                    "name": "Thornton Lane Solar Farm Ltd"
                                                },
                                                {
                                                    "name": "Gretton Solar Farm Ltd"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "West Hartford Wood Limited"
                        },
                        {
                            "name": "BPoD BIF Solar Ltd (House Farm)"
                        },
                        {
                            "name": "BPoD BIF Solar Ltd (Illustration Farm)"
                        },
                        {
                            "name": "BPoD WTP Solar Ltd (Water Hall Farm)"
                        },
                        {
                            "name": "BPoD TFP Solar Ltd (Car Cottages)"
                        },
                        {
                            "name": "BPoD LHF Solar Ltd (Lower Horton)"
                        },
                        {
                            "name": "Blossom 2 Solar Ltd",
                            "children": [
                                {
                                    "name": "GPP Big Field LLP"
                                },
                                {
                                    "name": "GPP Black Bush LLP"
                                },
                                {
                                    "name": "GPP Eastcott LLP"
                                },
                                {
                                    "name": "GPP Langstone LLP"
                                }
                            ]
                        },
                        {
                            "name": "Kirkheighly Mt Solar Ltd"
                        },
                        {
                            "name": "Willows Farm Solar Ltd"
                        },
                        {
                            "name": "Yelvertoft Solar Farm Ltd"
                        },
                        {
                            "name": "Blossom 1 Solar Ltd"
                        }
                    ]
                },
                {
                    "name": "Bluefield Partners LLP"
                }
            ]
        },
        "success": true
    });
    let filePathLocal = req.file.path;
    const key = req.file.filename;

    if (key.slice(-4) == ".pdf")
        filePathLocal = await convertPdfToImage(filePathLocal);

    if (!filePathLocal)
        throw new ApiError(STATUS_CODES.BAD_REQUEST, "Avatar file is missing");
    const file = await uploadOnCloudinary(filePathLocal);
    if (!file)
        throw new ApiError(
            STATUS_CODES.BAD_REQUEST,
            "Error while uploading avatar."
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
    const dborgChart = await OrgChart.create({
        imageKey: key,
        json: jsonString,
        imageUrl: file?.url || "",
    }).then((orgChart) => {
        console.log("Org chart created:", orgChart);
    }).catch((error) => {
        console.error("Error creating org chart:", error);
        throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to create org chart");
    });
    console.log("😀Org chart saved to database:", dborgChart);
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


module.exports = {
    fetchOrgChartJsonController
};

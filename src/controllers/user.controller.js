const path = require("path");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler");
const { OrgChart } = require("../models/orgchart.model.js");
const uploadOnCloudinary = require("../services/cloudinary.js");
// Path to users file
const { COOKIEOPTIONS, STATUS_CODES } = require("../utils/constants.js");
const { extractHierarchyFromImage } = require("../services/openai.js");

// @desc upload org chart JSON file
// @route POST /user/fetch-json
const fetchOrgChartJsonController = asyncHandler(async (req, res) => {
    const filePathLocal = req.file.path;
    const key = req.file.filename;
    if (!filePathLocal)
        throw new ApiError(STATUS_CODES.BAD_REQUEST, "Avatar file is missing");
    const file = await uploadOnCloudinary(filePathLocal);
    if (!file)
        throw new ApiError(
            STATUS_CODES.BAD_REQUEST,
            "Error while uploading avatar."
        );

    // OrgChart.create({
    //     image: file?.url || ""
    // }).then((orgChart) => {
    //     console.log("Org chart created:", orgChart);
    // }).catch((error) => {
    //     console.error("Error creating org chart:", error);
    //     throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to create org chart");
    // });

    const extractedData = await extractHierarchyFromImage(file?.url);



    res.status(STATUS_CODES.OK).json(
        new ApiResponse(
            STATUS_CODES.OK,
            "Org chart JSON file fetched successfully",
            extractedData
        )
    );
});


// @desc fetch current user
// @route GET /user/me
// protected = true
// const fetchCurrentUser = asyncHandler(async (req, res) => {
//   res
//     .status(STATUS_CODES.OK)
//     .json(STATUS_CODES.OK, req.user, "Current user fetched successfully");
// });

// @desc update current user
// @route POST /user/update-user
// protected = true
// const updateCurrentUser = asyncHandler(async (req, res) => {
//   const { fullName, email } = req.body;
//   if (!fullName || !email)
//     throw new ApiError(STATUS_CODES.BAD_REQUEST, "All fields are required.");
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         fullName,
//         email,
//       },
//     },
//     { new: true }
//   ).select("-password");

//   res
//     .status(STATUS_CODES.OK)
//     .json(
//       new ApiResponse(
//         STATUS_CODES.OK,
//         "Account details updated successfully",
//         user
//       )
//     );
// });

// // @desc update current user avatar
// // @route POST /user/update-avatar
// // protected = true
// const updateUserAvatar = asyncHandler(async (req, res) => {
//   const avatarLocalPath = req.file.path;
//   if (!avatarLocalPath)
//     throw new ApiError(STATUS_CODES.BAD_REQUEST, "Avatar file is missing");
//   // we should delete previous avatar
//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   if (!avatar)
//     throw new ApiError(
//       STATUS_CODES.BAD_REQUEST,
//       "Error while uploading avatar."
//     );
//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//       $set: {
//         avatar: avatar.url,
//       },
//     },
//     {
//       new: true,
//     }
//   ).select("-password");
//   if (!user) throw new ApiError(STATUS_CODES.BAD_REQUEST, "User not found.");
//   return res
//     .status(STATUS_CODES.OK)
//     .json(
//       new ApiResponse(
//         STATUS_CODES.OK,
//         "Avatar image updated successfully",
//         user
//       )
//     );
// });

module.exports = {
    fetchOrgChartJsonController
};

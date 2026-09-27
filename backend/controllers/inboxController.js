import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const messageRead = asyncHandler(async (req, res) => {
  const { id, message_id } = req.params;
  const { unread } = req.body;

  try {
    console.log(`User ID interacting: ${id}`);
    console.log(`Targeting Message UUID: ${message_id}`);

    // Database example targeting a specific subdocument inside an array:
    // await User.updateOne(
    //   { _id: id, "myInbox._id": message_id },
    //   { $set: { "myInbox.$.unread": unread } }
    // );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Message status updated successfully."));
  } catch (err) {
    throw new ApiError(500, "Failed to update target message state.");
  }
});
export { messageRead };

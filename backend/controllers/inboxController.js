

const messageRead = async (req,res) =>{
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

    return res.status(200).json({ message: "Message status updated successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update target message state." });
  }
}
export {
    messageRead
}
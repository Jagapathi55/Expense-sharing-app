import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    // validation
    if (!name || !members || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Group name and members are required" });
    }

    const group = await Group.create({
      name,
      members,
    });

    res.status(201).json({
      message: "Group created successfully",
      groupId: group._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Group creation failed", error: error.message });
  }
};

import Balance from "../models/Balance.js";

export const getUserBalances = async (req, res) => {
  try {
    const { userId } = req.params;

    const balance = await Balance.findOne({ user: userId }).populate(
      "user",
      "name email"
    );

    if (!balance) {
      return res.status(200).json({ balances: {} });
    }

    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch balances" });
  }
};

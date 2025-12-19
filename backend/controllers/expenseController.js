import Expense from "../models/Expense.js";
import Balance from "../models/Balance.js";

export const addExpense = async (req, res) => {
  try {
    const { groupId, amount, paidBy, splitType, splits } = req.body;

    if (!groupId || !amount || !paidBy || !splitType || !splits) {
      return res.status(400).json({ message: "Invalid expense data" });
    }

    let calculatedSplits = [];

    if (splitType === "EQUAL") {
      const splitAmount = amount / splits.length;

      calculatedSplits = splits.map((user) => ({
        user,
        amount: splitAmount,
      }));
    }

    if (splitType === "EXACT") {
      const total = splits.reduce((sum, s) => sum + s.amount, 0);
      if (total !== amount) {
        return res.status(400).json({ message: "Exact split total mismatch" });
      }

      calculatedSplits = splits;
    }

    if (splitType === "PERCENT") {
      const totalPercent = splits.reduce((sum, s) => sum + s.percent, 0);
      if (totalPercent !== 100) {
        return res.status(400).json({ message: "Percentage must total 100%" });
      }

      calculatedSplits = splits.map((s) => ({
        user: s.user,
        amount: (s.percent / 100) * amount,
      }));
    }

    const expense = await Expense.create({
      group: groupId,
      amount,
      paidBy,
      splitType,
      splits: calculatedSplits,
    });

    for (let split of calculatedSplits) {
      if (split.user.toString() === paidBy) continue;

      let userBalance = await Balance.findOne({ user: split.user });
      if (!userBalance) {
        userBalance = await Balance.create({ user: split.user });
      }

      let paidByBalance = await Balance.findOne({ user: paidBy });
      if (!paidByBalance) {
        paidByBalance = await Balance.create({ user: paidBy });
      }

      userBalance.balances.set(
        paidBy,
        (userBalance.balances.get(paidBy) || 0) + split.amount
      );

      paidByBalance.balances.set(
        split.user,
        (paidByBalance.balances.get(split.user) || 0) - split.amount
      );

      await userBalance.save();
      await paidByBalance.save();
    }

    res.status(201).json({
      message: "Expense added successfully",
      expenseId: expense._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add expense",
      error: error.message,
    });
  }
};

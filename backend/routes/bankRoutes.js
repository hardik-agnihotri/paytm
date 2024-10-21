import express from 'express';
import { authMiddleware } from '../middleware.js';
import Account from '../models/bankModel.js';
import mongoose from 'mongoose';

const router = express.Router()
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        const roundedBalance = account.balance.toFixed(2); // Round the balance to 2 decimal places

        res.json({
            balance: roundedBalance
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching balance",
            error: error.message
        });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Validate input
        if (!amount || !to) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Amount and recipient are required"
            });
        }

        // Ensure the amount is a positive number
        if (amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Account not found"
            });
        }

        // Check if sufficient balance is available
        if (account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid recipient account"
            });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction(); // Ensure transaction is aborted on error
        console.error("Transfer error:", error);
        res.status(500).json({
            message: "An error occurred while processing the transfer",
            error: error.message
        });
    } finally {
        session.endSession(); // End the session
    }
});


export default router
const Pawn = require("../models/Pawn");
const Customer = require("../models/Customer");
const Receipt = require("../models/Receipt");
const { addDays } = require("../utils/DateUtil");
const InterestRate = require("../models/InterestRate");
const getScheduleInterestRate = require("../utils/getScheduleInterestRate");
const { calculateMonthlyInterest } = require("../utils/InterestUtils");
const { generateReceiptNumber } = require("../utils/GenerateReceipt");

exports.createPawn = async (req, res) => {
    try {

        const { customerId, itemName, appraisalValue, loanAmount, startDate } = req.body;

        const maturityDate = addDays(startDate, 30);
        const expiryDate = addDays(startDate, 120);

        const today = new Date();

        const currentInterest = await InterestRate
            .findOne({ effectivityDate: { $lte: today } })
            .sort({ effectivityDate: -1 });

        if(!currentInterest){
            return res.status(400).json({
                error: "No active interest rate found. Please set interest rate first."
            });
        }

        const appraisal = Number(appraisalValue);
        const loan = Number(loanAmount);

        if(loan > appraisal) {
            return res.status(400).json({
                message: "Loan amount should not exceed appraisal value."
            });

        }

        const pawn = await Pawn.create({
            customerId,
            itemName,
            appraisalValue,
            loanAmount,
            balance: loanAmount,
            startDate,
            maturityDate,
            expiryDate,
            interestRate: currentInterest.rate,
            interestType: "Monthly",
            interestAccrued: 0,
            interestPaid: 0,
            interestBalance: 0,
            totalPenalty: 0,
            itemPhotoUrl: req.file ? req.file.path : undefined,
            createdBy: req.user._id
        });


        const receiptNumber = await generateReceiptNumber();

        // Create receipt for pawn creation
        const receipt = await Receipt.create({
            pawnId: pawn._id,
            actionType: "Pawn",
            amount: loanAmount,
            interestPaid: 0,
            interestRate: pawn.interestRate, 
            oldMaturity: null,
            newMaturity: maturityDate,
            date: new Date(),
            createdBy: req.user._id,
            customerId,
            receiptNumber
        });

        pawn.actions = [
            {
                actionType: "Pawn",
                actionDate: new Date(),
                amount: loanAmount,
                newMaturityDate: maturityDate,
                staff: req.user.firstname,
                receiptId: receipt._id
            }
        ];

        await Customer.findByIdAndUpdate(customerId, {
            $inc: { pawnCount: 1, pendingLoans: 1 }
        });

        const populatedReceipt = await Receipt.findById(receipt._id)
            .populate({
                path: "customerId",
                populate: { path: "userId", select: "firstname lastname" }
            })
            .populate("pawnId")
            .populate("createdBy", "firstname lastname");

        res.status(201).json({ message: "Pawn created successfully", pawn, receipt: populatedReceipt });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPawns = async (req, res) => {
    try {
        const pawns = await Pawn.find()
            .populate({
                path: "customerId",
                populate: {
                    path: "userId",
                    select: "firstname lastname"
                }
            })
            .populate("createdBy", "firstname lastname role")
            .populate({
                path: "renewals.receiptId", 
                select: "amount"
            })
            .sort({ createdAt: -1 });

        const today = new Date();
        const pawnsWithScheduleRate = [];

        for (const p of pawns) {
            // Expiry check
            if (p.status === "Active" && p.expiryDate && today > p.expiryDate) {
                p.status = "Expired";
                await p.save();
            }

            // Determine next payment number
            const paymentNumber = (p.payments?.length || 0) + 1;

            // Get next schedule interest rate
            const nextScheduleRate = await getScheduleInterestRate(p.startDate, paymentNumber);

            // Attach it to pawn object (frontend can use this directly)
            pawnsWithScheduleRate.push({
                ...p.toObject(),
                nextScheduleRate: nextScheduleRate || 0
            });
        }

        res.status(200).json({ pawns: pawnsWithScheduleRate });
    } catch (err) {
        console.error("getAllPawns error:", err);
        res.status(500).json({ error: err.message });
    }
};


exports.addPayment = async (req, res) => {
    try {
        const { pawnId } = req.params;
        const { amount, penaltyPaid = 0 } = req.body;

        const pawn = await Pawn.findById(pawnId);
        if (!pawn) {
            return res.status(404).json({ error: "Pawn not found" });
        }

        // Determine payment number (1-based)
        const paymentNumber = (pawn.payments?.length || 0) + 1;

        // Get the correct schedule rate for this payment
        const scheduleRate = await getScheduleInterestRate(pawn.startDate, paymentNumber);

        if (!scheduleRate) {
            return res.status(400).json({
                error: "No active payment schedule rate found"
            });
        }
        const interestDue = 
        calculateMonthlyInterest(
            pawn.balance,
            scheduleRate
        );

        let remainingPayment = Number(amount);
        let interestPaid = Math.min(remainingPayment, interestDue);
        remainingPayment -= interestPaid;

        let principalPaid = Math.min(remainingPayment, pawn.balance);

        pawn.balance -= principalPaid;
        pawn.interestPaid += interestPaid;
        pawn.interestBalance = Math.max(interestDue - interestPaid, 0);
        pawn.totalPenalty += penaltyPaid;

        // 4️⃣ Receipt
        const receiptNumber = await generateReceiptNumber();
        const receipt = await Receipt.create({
            pawnId,
            actionType: "Payment",
            amount: principalPaid,
            interestPaid,
            interestRate: scheduleRate,
            oldMaturity: pawn.maturityDate,
            newMaturity: pawn.maturityDate,
            date: new Date(),
            createdBy: req.user._id,
            customerId: pawn.customerId,
            receiptNumber
        });

        // 5️⃣ Log payment
        pawn.payments.push({
            amount: principalPaid,
            interestPaid,
            interestRate: scheduleRate,
            penaltyPaid,
            date: new Date(),
            receiptId: receipt._id
        });

        await pawn.save();

        const populatedReceipt = await Receipt.findById(receipt._id)
            .populate({
                path: "customerId",
                populate: { path: "userId", select: "firstname lastname" }
            })
            .populate("pawnId", "itemName");

        res.json({
            message: "Payment added successfully",
            pawn,
            receipt: populatedReceipt
        });

    } catch (err) {
        console.error("addPayment error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.renewPawn = async (req, res) => {
    try {
        const { pawnId } = req.params;

        const pawn = await Pawn.findById(pawnId);
        if (!pawn) {
            return res.status(404).json({ error: "Pawn not found" });
        }

        const oldMaturity = pawn.maturityDate;
        const newMaturity = addDays(oldMaturity, 30);

        const interestDue = calculateMonthlyInterest(
            pawn.loanAmount,
            pawn.interestRate
        );

        const receiptNumber = await generateReceiptNumber();

        const receipt = await Receipt.create({
            pawnId,
            actionType: "Renewal",
            amount: interestDue,
            interestPaid: interestDue,
            oldMaturity,
            newMaturity,
            date: new Date(),
            createdBy: req.user._id,
            customerId: pawn.customerId,
            receiptNumber
        });

        pawn.renewals.push({
            oldMaturity,
            newMaturity,
            renewalDate: new Date(),
            interestPaid: interestDue,
            receiptId: receipt._id
        });

        pawn.interestPaid += interestDue;
        pawn.maturityDate = newMaturity;
        pawn.expiryDate = addDays(newMaturity, 90);
        pawn.status = "Renewed";

        await pawn.save();

        const populatedReceipt = await Receipt.findById(receipt._id)
            .populate({
                path: "customerId",
                populate: { path: "userId", select: "firstname lastname" }
            })
            .populate("pawnId");

        res.json({
            message: "Pawn renewed successfully",
            pawn,
            receipt: populatedReceipt
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.redeemPawn = async (req, res) => {
    try {
        const { pawnId } = req.params;
        const pawn = await Pawn.findById(pawnId);
        if (!pawn) return res.status(404).json({ error: "Pawn not found" });

        const today = new Date();

        const totalDue = pawn.balance; // current balance includes principal + interest

        const receiptNumber = await generateReceiptNumber();
        const receipt = await Receipt.create({
            pawnId,
            actionType: "Redemption",
            amount: totalDue,
            interestPaid: pawn.interestBalance,
            interestRate: pawn.interestRate,
            oldMaturity: pawn.maturityDate,
            newMaturity: null,
            date: today,
            createdBy: req.user._id,
            customerId: pawn.customerId,
            receiptNumber
        });

        pawn.balance = 0; // ✅ fully paid
        pawn.interestPaid += pawn.interestBalance;
        pawn.interestBalance = 0;
        pawn.status = "Redeemed";
        pawn.redeemedDate = today;
        pawn.redeemedReceiptId = receipt._id;

        await Customer.findByIdAndUpdate(pawn.customerId, {
            $inc: { redeemedCount: 1, pendingLoans: -1 }
        });

        await pawn.save();

        const populatedReceipt = await Receipt.findById(receipt._id)
            .populate({
                path: "customerId",
                populate: { path: "userId", select: "firstname lastname" }
            })
            .populate("pawnId");

        res.json({ message: "Pawn redeemed", pawn, receipt: populatedReceipt });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.forfeitPawn = async (req, res) => {
    try {
        const { pawnId } = req.params;
        const pawn = await Pawn.findById(pawnId);
        if (!pawn) return res.status(404).json({ error: "Pawn not found" });

        const receipt = await Receipt.create({
            pawnId,
            actionType: "Forfeited",
            amount: 0,
            interestPaid: 0,
            oldMaturity: pawn.maturityDate,
            newMaturity: null,
            date: new Date(),
            createdBy: req.user._id,
            customerId: pawn.customerId
        });

        pawn.status = "Forfeited";
        pawn.forfeitedDate = new Date();
        pawn.forfeitedReceiptId = receipt._id;

        await pawn.save();

        res.json({ message: "Pawn forfeited", pawn });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyPawns = async (req, res) => {
    try {
        const customer = await Customer.findOne({ userId: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const pawns = await Pawn.find({ customerId: customer._id })
            .sort({ startDate: -1 })
            .populate({
                path: "customerId",
                populate: { path: "userId", select: "firstname lastname" }
            })
            .populate("createdBy", "firstname lastname")
            .lean();

        const history = [];

        for (const pawn of pawns) {
            const actions = [];
            let runningBalance = pawn.loanAmount;

            const pawnReceipt = await Receipt.findOne({ pawnId: pawn._id, actionType: "Pawn" });
            actions.push({
                actionDate: pawn.startDate,
                actionType: "Pawn",
                amount: pawn.loanAmount,
                balance: runningBalance,
                penalty: 0,
                newMaturityDate: null,
                staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                receiptId: pawnReceipt?._id || null,
                receiptNumber: pawnReceipt?.receiptNumber || null
            });

            // Renewals
            if (pawn.renewals?.length) {
                for (const r of pawn.renewals) {
                    const renewalReceipt = await Receipt.findOne({
                        pawnId: pawn._id,
                        actionType: "Renewal",
                        newMaturity: r.newMaturity
                    });
                    const interestAmount = renewalReceipt ? renewalReceipt.amount : 0;
                    runningBalance += interestAmount;
                    actions.push({
                        actionDate: r.renewalDate,
                        actionType: "Renewal",
                        amount: interestAmount,
                        balance: runningBalance,
                        penalty: 0,
                        interestRate: pawn.interestRate,
                        newMaturityDate: r.newMaturity,
                        staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                        receiptId: renewalReceipt?._id || null,
                        receiptNumber: renewalReceipt?.receiptNumber || null
                    });
                }
            }

            // Payments
            if (pawn.payments?.length) {
                for (const p of pawn.payments) {
                    runningBalance -= p.amount;
                    const paymentReceipt = await Receipt.findById(p.receiptId);
                    actions.push({
                        actionDate: p.date,
                        actionType: "Payment",
                        amount: p.amount,
                        balance: runningBalance,
                        penalty: p.penaltyPaid || 0,
                        interestRate: pawn.interestRate,
                        newMaturityDate: null,
                        staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                        receiptId: paymentReceipt?._id || null,
                        receiptNumber: paymentReceipt?.receiptNumber || null
                    });
                }
            }

            // Redemption
            if (pawn.status === "Redeemed") {
                const redeemReceipt = await Receipt.findOne({
                    pawnId: pawn._id,
                    actionType: "Redemption"
                });
                runningBalance = 0;
                actions.push({
                    actionDate: pawn.redeemedDate || pawn.maturityDate,
                    actionType: "Redemption",
                    amount: redeemReceipt ? redeemReceipt.amount : pawn.loanAmount,
                    balance: runningBalance,
                    penalty: 0,
                    interestRate: pawn.interestRate,
                    newMaturityDate: null,
                    staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                    receiptId: redeemReceipt?._id || null,
                    receiptNumber: redeemReceipt?.receiptNumber || null
                });
            }

            // Forfeited
            if (pawn.status === "Forfeited") {
                const forfeitedReceipt = await Receipt.findOne({
                    pawnId: pawn._id,
                    actionType: "Forfeited"
                });
                runningBalance = 0;
                actions.push({
                    actionDate: pawn.forfeitedDate,
                    actionType: "Forfeited",
                    amount: 0,
                    balance: runningBalance,
                    penalty: 0,
                    newMaturityDate: null,
                    staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                    receiptId: forfeitedReceipt?._id || null,
                    receiptNumber: forfeitedReceipt?.receiptNumber || null
                });
            }

            history.push({
                pawnId: pawn._id,
                itemName: pawn.itemName,
                status: pawn.status,
                amount: pawn.loanAmount,  
                balance: runningBalance,   
                startDate: pawn.startDate,       
                maturityDate: pawn.maturityDate,
                expiryDate: pawn.expiryDate,
                actions: actions.sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate))
            });
        }

        res.json({ pawns: history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



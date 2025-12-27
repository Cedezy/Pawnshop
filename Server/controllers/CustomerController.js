const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Pawn = require("../models/Pawn");
const Receipt = require("../models/Receipt");

exports.createCustomer = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            firstname: req.body.firstName,
            middlename: req.body.middleName,
            lastname: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            role: "customer",
            isActive: true
        });

        // Cloudinary URLs
        const photoUrl = req.files?.photo ? req.files.photo[0].path : null;
        const idPhotoUrl = req.files?.idPhoto ? req.files.idPhoto[0].path : null;

        const customer = await Customer.create({
            userId: user._id,
            dateOfBirth: req.body.dateOfBirth,
            sex: req.body.sex,
            phone: req.body.phone,
            street: req.body.street,
            barangay: req.body.barangay,
            city: req.body.city,
            province: req.body.province,
            civilStatus: req.body.civilStatus,
            nationality: req.body.nationality,
            zipCode: req.body.zipCode,
            idType: req.body.idType,
            idNumber: req.body.idNumber,
            idExpiryDate: req.body.idExpiryDate,
            photoUrl,    
            idPhotoUrl, 
            status: "Active"
        });

        // 🔥 POPULATE BEFORE RETURNING
        const populatedCustomer = await Customer.findById(customer._id)
            .populate("userId");

        res.status(201).json({
            message: "Customer added successfully",
            customer: populatedCustomer
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .select("-password")
            .populate("userId", "firstname lastname middlename email")
            .sort({ createdAt: -1 }); // newest first

        res.json({ customers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select("-password");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        // List of fields admin/cashier can update
        const allowedFields = [
            "firstName", "middleName", "lastName", "dateOfBirth", "sex",
            "phone", "street", "barangay", "city", "province",
            "zipCode", "idType", "idNumber", "idExpiryDate", "idPhotoUrl",
            "photoUrl", "blacklistReason", "pawnCount", "redeemedCount", "pendingLoans",
            "status" // optional, e.g., Blacklist/Active
        ];

        // Update only allowed fields, ignore password
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                customer[field] = req.body[field];
            }
        });

        await customer.save();

        const customerData = customer.toObject();
        delete customerData.password; // never send password
        res.json({ message: "Customer updated successfully", customer: customerData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleCustomerStatus = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        // Toggle status: Active <-> Inactive
        customer.status = customer.status === "Active" ? "Inactive" : "Active";
        await customer.save();

        res.json({ message: `Customer is now ${customer.status}`, customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerTransactionHistory = async (req, res) => {
    try {
        const customerId = req.params.id;

        const pawns = await Pawn.find({ customerId })
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

            // Pawn action
            const pawnReceipt = await Receipt.findOne({ pawnId: pawn._id, actionType: "Pawn" });
            actions.push({
                actionDate: pawn.startDate,
                actionType: "Pawn",
                amount: pawn.loanAmount,
                newMaturityDate: null,
                staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                receiptId: pawnReceipt?._id || null,
                receiptNumber: pawnReceipt?.receiptNumber || null,
                interest: 0,
                interestRate: 0
            });

            // Renewals
            if (pawn.renewals?.length) {
                for (const r of pawn.renewals) {
                    const renewalReceipt = await Receipt.findOne({
                        pawnId: pawn._id,
                        actionType: "Renewal",
                        newMaturity: r.newMaturity
                    });
                    actions.push({
                        actionDate: r.renewalDate,
                        actionType: "Renewal",
                        amount: renewalReceipt ? renewalReceipt.amount : 0,
                        interest: pawn.interestRate,
                        interestRate: pawn.interestRate,
                        newMaturityDate: r.newMaturity,
                        staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                        receiptId: renewalReceipt?._id || null,
                        receiptNumber: renewalReceipt?.receiptNumber || null
                    });
                }
            }

            if (pawn.payments?.length) {
                for (const p of pawn.payments) {
                    const paymentReceipt = await Receipt.findById(p.receiptId)
                        .populate("createdBy", "firstname lastname");

                    // Calculate the schedule interest rate as % if you have loanAmount
                    const paymentInterestRate = pawn.loanAmount
                        ? (p.interestPaid / pawn.loanAmount) * 100
                        : 0;

                    actions.push({
                        actionDate: p.date,
                        actionType: "Payment",
                        amount: p.amount,
                        interest: p.interestPaid || 0, 
                        interestRate: paymentInterestRate, 
                        newMaturityDate: null,
                        staff: paymentReceipt?.createdBy
                            ? `${paymentReceipt.createdBy.firstname} ${paymentReceipt.createdBy.lastname}`
                            : pawn.createdBy
                                ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}`
                                : "N/A",
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
                actions.push({
                    actionDate: pawn.redeemedDate || pawn.maturityDate,
                    actionType: "Redemption",
                    amount: redeemReceipt ? redeemReceipt.amount : pawn.loanAmount,
                    interest: pawn.interestRate,
                    interestRate: pawn.interestRate,
                    newMaturityDate: null,
                    staff: pawn.createdBy ? `${pawn.createdBy.firstname} ${pawn.createdBy.lastname}` : "N/A",
                    receiptId: redeemReceipt?._id || null,
                    receiptNumber: redeemReceipt?.receiptNumber || null
                });
            }

            history.push({
                pawnId: pawn._id,
                itemName: pawn.itemName,
                status: pawn.status,
                actions: actions.sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate))
            });
        }

        res.json({ transactionHistory: history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getOwnProfile = async (req, res) => {
    try {
        const customer = await Customer.findOne({ userId: req.user._id })
            .populate("userId", "firstname lastname email");

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateOwnProfile = async (req, res) => {
    try {
        const customer = await Customer.findOne({ userId: req.user._id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Only allow updating certain fields
        const allowedFields = ["phone", "street", "barangay", "city", "province", "zipCode"];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                customer[field] = req.body[field];
            }
        });

        await customer.save();

        res.json({
            message: "Profile updated successfully",
            customer
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


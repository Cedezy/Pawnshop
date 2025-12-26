const bcrypt = require("bcrypt");
const Staff = require("../models/Staff");
const User = require("../models/User");

exports.createStaff = async (req, res) => {
    try {
        const { firstname, lastname, middlename, email, phone, street, barangay, city, province, zipCode, role, password } = req.body;

        console.log("Request body:", req.body); // Debug

        // Validate role
        if (!["manager", "appraiser"].includes(role)) {
            return res.status(403).json({ message: "Invalid role for staff profile" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            firstname,
            lastname,
            middlename,
            email,
            password: hashedPassword,
            role,
            isActive: true
        });

        console.log("Created user:", user);

        // Create staff profile
        const staff = await Staff.create({
            userId: user._id,
            phone,
            street,
            barangay,
            city,
            province,
            zipCode
        });

        const populatedStaff = await Staff.findById(staff._id).populate("userId", "-password");

        res.status(201).json({
            message: "Staff profile created successfully",
            staff: populatedStaff
        });

    } catch (error) {
        console.log("Error creating staff:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find()
            .populate("userId", "firstname middlename lastname email role lastLogin isActive");

        res.status(200).json({staff});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id)
            .populate("userId", "firstname middlename lastname email role lastLogin");

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const updated = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.status(200).json({
            message: "Staff profile updated",
            staff: updated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deactivateStaff = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const fullName = `${user.firstname} ${user.lastname}`;

        res.json({
            message: `${fullName} has been deactivated successfully.`,
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.reactivateStaff = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const fullName = `${user.firstname} ${user.lastname}`;

        res.json({
            message: `${fullName} has been reactivated successfully.`,
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// UPDATE User (admin can change role/status but not password)
exports.updateUser = async (req, res) => {
    try {
        const { firstname, middlename, lastname, email, role, isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (firstname) user.firstname = firstname;
        if (middlename) user.middlename = middlename;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;
        if (role && ["manager", "appraiser", "admin"].includes(role)) {
    user.role = role;
}

        if (typeof isActive === "boolean") user.isActive = isActive;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCurrentUser = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");

        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } 
    catch(err){
        res.status(500).json({ success: false, message: "Failed to fetch user.", error: err.message });
    }
};

// UPDATE CURRENT USER PASSWORD (admin self-account)
exports.updateMyPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters long."
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash & save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

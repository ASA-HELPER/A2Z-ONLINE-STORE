import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, resp) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        // validations
        if (!name) {
            return resp.send({ message: 'Name is required' })
        }
        if (!email) {
            return resp.send({ message: 'Email is required' })
        }
        if (!password) {
            return resp.send({ message: 'Password is required' })
        }
        if (!phone) {
            return resp.send({ message: 'Phone number is required' })
        }
        if (!address) {
            return resp.send({ message: 'Address is required' })
        }
        if (!answer) {
            return resp.send({ message: 'Answer is required' })
        }
        // Checking if the user exists
        const existingUser = await userModel.findOne({ email });
        // existing user
        if (existingUser) {
            return resp.status(200).send({
                success: false,
                message: 'Already register please login',
            })
        }
        // register user
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save();
        resp.status(201).send({
            success: true,
            message: 'User register successfully',
            user
        })
    }
    catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: 'Error in registeration',
            error
        })
    }
};

// POST LOGIN
export const loginController = async (req, resp) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return resp.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return resp.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return resp.status(200).send({
                success: false,
                message: 'Invalid Password',
            })
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        resp.status(200).send({
            success: true,
            message: 'Login Successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        })
    }
    catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
};

// Forgot Password COntroller
export const forgotPasswordController = async (req, resp) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            resp.status(400).send({
                message: 'Email is required'
            })
        }
        if (!answer) {
            resp.status(400).send({
                message: 'Answer is required'
            })
        }
        if (!newPassword) {
            resp.status(400).send({
                message: 'New password is required'
            })
        }
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            return resp.status(404).send({
                success: false,
                message: 'Wrong email or answer'
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        resp.status(200).send({
            success: true,
            message: 'Password Reset Successfully'
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

// Test controller
export const testController = (req, resp) => {
    try {
        resp.send("Protected Routes");
    } catch (error) {
        console.log(error);
        resp.send({ error });
    }
}

//update prfole
export const updateProfileController = async (req, resp) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return resp.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        resp.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        resp.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};

// Orders
export const getOrdersController = async (req, resp) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        resp.json(orders)
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })
    }
}

// all orders 
export const getAllOrdersController = async (req, resp) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: "-1" })
        resp.json(orders)
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })
    }
}

// Order status
export const orderStatusController = async (req, resp) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        resp.json(orders)
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "Error while updating order",
            error
        })
    }
}
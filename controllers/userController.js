// Register User : api/user/register
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { isDemoMode, jwtSecret } from "../configs/runtime.js";
import { createDemoId, demoUsers, publicUser } from "../data/demoStore.js";


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing values name,email,password' })
        }
        if (isDemoMode) {
            const existingUser = demoUsers.find((user) => user.email === email);
            if (existingUser) {
                return res.json({ success: false, message: 'User Already exist' })
            }

            const user = {
                _id: createDemoId("user"),
                name,
                email,
                password: await bcrypt.hash(password, 10),
                cartItems: {},
            };
            demoUsers.push(user);

            const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.json({ success: true, user: publicUser(user) })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: 'User Already exist' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword })

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        });
        return res.json({ success: true, user: { email: user.email, name: user.name } })

    }
    catch (error) {
        console.log(error.message);

        res.json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' })
        }
        if (isDemoMode) {
            const user = demoUsers.find((item) => item.email === email);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.json({ success: false, message: 'Invalid email or password' })
            }

            const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.json({ success: true, user: publicUser(user) })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid email or password' })
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        });
        return res.json({ success: true, user: { email: user.email, name: user.name } })

    } catch (error) {
        console.log(error.message);

        res.json({ success: false, message: error.message })

    }
}


// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        if (isDemoMode) {
            const user = demoUsers.find((item) => item._id === req.userId);
            if (!user) {
                return res.json({ success: false, message: "User not found" });
            }
            return res.json({ success: true, user: publicUser(user) });
        }

        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({success: true, user});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message}); 
    }
}
//Logout user :/api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({ success: true, message: "Logged out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

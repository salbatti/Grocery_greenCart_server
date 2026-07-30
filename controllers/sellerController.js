import jwt from 'jsonwebtoken'
import { jwtSecret } from '../configs/runtime.js'
//Login Seller :/api/seller/login

export const sellerLogin = async (req, res) => {
   try {
     const { email, password } = req.body

    const sellerEmail = process.env.SELLER_EMAIL || 'seller@greencart.dev';
    const sellerPassword = process.env.SELLER_PASSWORD || 'seller123';

    if (email == sellerEmail && password== sellerPassword) {
        const token = jwt.sign({ email }, jwtSecret, { expiresIn: '7d' })
        res.cookie('sellerToken', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        });
        return res.json({ success: true, message: "Logged In" })
    }
    else {
        return res.json({ success: false, message: "Invalid Credentials" })
    }
   } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
   }
}

//Seller Auth :/api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
 
//Logout seller :/api/seller/logout

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({ success: true,message:"Logged out"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

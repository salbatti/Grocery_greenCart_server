import User from "../models/User.js"
import { isDemoMode } from "../configs/runtime.js"
import { demoUsers } from "../data/demoStore.js"
// Update User CartData : /api/cart/update

export const updateCart = async (req, res) => {
    try {
        const {cartItems } = req.body
        const userId = req.userId
        if (isDemoMode) {
            const user = demoUsers.find((item) => item._id === userId)
            if (user) {
                user.cartItems = cartItems
            }
            return res.json({ success: true, message: "Cart Updated" })
        }
 
        await User.findByIdAndUpdate(userId, { cartItems })
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

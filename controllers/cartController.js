import User from "../models/User.js"
// Update User CartData : /api/cart/update

export const updateCart = async (req, res) => {
    try {
        const { userId, cartItem } = req.body
        //doubt
        await User.findByIdAndUpdate(userId, { cartItem })
        res.json({ success: false, message: "Cart Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

import Order from "../models/Order.js"
import Product from "../models/Product.js"
import stripe from "stripe"
import { isDemoMode } from "../configs/runtime.js"
import { createDemoId, demoOrders, demoProducts, demoUsers, hydrateOrder } from "../data/demoStore.js"
// Place Order COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        if (!address || items.length == 0) {
            return res.json({ success: false, message: "Invalid data" })
        }
        if (isDemoMode) {
            let amount = items.reduce((sum, item) => {
                const product = demoProducts.find((product) => product._id === item.product);
                return sum + (product?.offerPrice || 0) * item.quantity;
            }, 0);
            amount += Math.floor(amount * 0.02);
            demoOrders.unshift({
                _id: createDemoId("order"),
                userId,
                items,
                amount,
                address,
                status: "Order Placed",
                paymentType: "COD",
                isPaid: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            const user = demoUsers.find((item) => item._id === userId);
            if (user) user.cartItems = {};
            return res.json({ success: true, message: "Order placed successfully" })
        }
        //Calculate amount using Items
        //doubt how does async and await comes 
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        //Add Tax Charge(2%)
        amount += Math.floor(amount * 0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD'
        });
        return res.json({ success: true, message: "Order placed successfully" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Place Order Stripe : /api/order/stripe

export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        const {origin}=req.headers;
        if (!address || items.length == 0) {
            return res.json({ success: false, message: "Invalid data" })
        }
        if (isDemoMode || !process.env.STRIPE_SECRET_KEY) {
            return placeOrderCOD(req, res)
        }

        let productData = []

        //Calculate amount using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price:product.offerPrice,
                quantity:item.quantity
            });
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        //Add Tax Charge(2%)
        amount += Math.floor(amount * 0.02)

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'Online'
        });
        //Stripe Gateway Initialize
        const stripeInstance = new stripe (process.env.STRIPE_SECRET_KEY)
        
        //create line items for stripe

        const line_items=productData.map((item)=>{
            return{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price+item.price*0.02)*100
                },
                quantity:item.quantity,
            }
        })

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId
            }
        })
        return res.json({ success: true,url:session.url })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get Orders by User ID : /api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        if (isDemoMode) {
            const orders = demoOrders.filter((order) => order.userId === userId).map(hydrateOrder)
            return res.json({ success: true, orders })
        }
     
        const orders = await Order.find({ userId }).populate("items.product address").sort({ createdAt: -1 });

        // //Doubt in populate
        res.json({ success: true, orders })
    } catch (error) {
        // console.log(error.mesaage);
        return res.json({ success: false, message: error.message })
    }
}




//Get All Orders (for seller/admin) :/api/order/seller

export const getAllOrders = async (req, res) => {
    try {
        if (isDemoMode) {
            const orders = demoOrders.map(hydrateOrder)
            return res.json({ success: true, orders })
        }

        const orders = await Order.find({
            $or: [{ paymentType: 'COD' }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        // console.log(error.mesaage);
        return res.json({ success: false, message: error.message })
    }
}

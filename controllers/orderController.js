
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import stripe from "stripe"
// Place Order COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        if (!address || items.length == 0) {
            return res.json({ success: false, mesaage: "Invalid data" })
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
        return res.json({ success: true, message: "Order placed succesfully" })
    } catch (error) {
        console.log(error.mesaage);
        return res.json({ success: false, mesaage: error.mesaage })
    }
}

// Place Order Stripe : /api/order/stripe

export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        const {origin}=req.headers;
        if (!address || items.length == 0) {
            return res.json({ success: false, mesaage: "Invalid data" })
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
        console.log(error.mesaage);
        return res.json({ success: false, mesaage: error.mesaage })
    }
}

// Get Orders by User ID : /api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
     
        const orders = await Order.find({ userId }).populate("items.product address").sort({ createdAt: -1 });

        // //Doubt in populate
        res.json({ success: true, orders })
    } catch (error) {
        // console.log(error.mesaage);
        return res.json({ success: false, mesaage: error.mesaage })
    }
}




//Get All Orders (for seller/admin) :/api/order/seller

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: 'COD' }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        // console.log(error.mesaage);
        return res.json({ success: false, mesaage: error.mesaage })
    }
}

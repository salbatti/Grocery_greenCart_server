import jwt from 'jsonwebtoken';
import { jwtSecret } from '../configs/runtime.js';

const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
        return res.json({ success: false, message: 'Not authorized' });
    }
    try {
        const tokenDecode = jwt.verify(sellerToken, jwtSecret)
        if (tokenDecode.email === (process.env.SELLER_EMAIL || 'seller@greencart.dev')) {
             next();
        } else {
            return res.json({ success: false, message: 'Not Authorized' });
        }
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export default authSeller;

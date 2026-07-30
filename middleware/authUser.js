import jwt from 'jsonwebtoken'
import { jwtSecret } from '../configs/runtime.js';
const authUser = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized' });
    }
    try {
        const tokenDecode = jwt.verify(token, jwtSecret)
        if (tokenDecode.id) {
            req.userId = tokenDecode.id
        } else {
            return res.json({ success: false, message: 'Not Authorized' });
        }
        next();//doubt
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default authUser

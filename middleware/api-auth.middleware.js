const jwt = require('jsonwebtoken')
const md = require('../models/Account.models');
require('dotenv').config();
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
exports.api_auth = async (req, res, next) => {
    let header_token = req.header('Authorization');
    console.log("toke gửi từ client lên: "+header_token);
    if (typeof (header_token) == 'undefined') {
        return res.status(403).json({ msg: 'Không xác định token' });
    }
    const token = header_token.replace('Bearer ', '')
    try {
        const data = jwt.verify(token, chuoi_ky_tu_bi_mat)
        console.log(data);
        const user = await md.AccountModel.findOne({ token: token })
        if (!user) {
            throw new Error("Không xác định được người dùng")
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: error.message })
    }
}
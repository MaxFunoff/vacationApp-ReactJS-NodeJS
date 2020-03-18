require('dotenv').config()
const jwt = require('jsonwebtoken')
const pool = require('../mysql/dbpool')
const refresh = require('./tokenRefresh')

module.exports = authenticateToken = async (req, res, next) => {
    const token = req.cookies.token
    const refreshToken = req.cookies.refresh

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err && !refreshToken) return res.sendStatus(403)
        else if (err && refreshToken) {
            try {
                refresh(req, res, refreshToken)
            }
            catch (err) {
                res.sendStatus(err)
            }
        }

        try {
            req.user = await bringUserType(user)
            next()
        }
        catch (err) {
            res.sendStatus(err)
        }
    });
}

bringUserType = async (user) => {
    let _user = { ...user };
    let query =
        `SELECT type
        FROM users
        WHERE id = ?`

    try {
        let mqRes = await pool.execute(query, [user.id])
        if (!mqRes[0][0]) throw 403

        _user.type = mqRes[0][0].type
    }
    catch (err) {
        if (typeof err === 'number')
            throw err
        else
            throw 500

    }

    return _user
}


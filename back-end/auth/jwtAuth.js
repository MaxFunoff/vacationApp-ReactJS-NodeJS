require('dotenv').config()
const jwt = require('jsonwebtoken')
const pool = require('../mysql/dbpool')

module.exports = authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403)

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
    let _user;
    let query =
        `SELECT type
        FROM users
        WHERE id = ?`

    try {
        let mqRes = await pool.execute(query, [user.id])
        if (!mqRes[0][0]) throw 403

        user.type = mqRes[0][0].type
        _user = user;
    }
    catch (err) {
        if (typeof err === 'number')
            throw err
        else
            throw 500

    }

    return _user
}


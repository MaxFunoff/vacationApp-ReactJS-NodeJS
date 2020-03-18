const jwt = require('jsonwebtoken')
const pool = require('../mysql/dbpool')

module.exports = tokenRefresh = async (req, res, token) => {

    const query =
        `SELECT * 
    FROM tokens
    WHERE token = ?`

    try {
        let mqRes = await pool.execute(query, [token])
        if (!mqRes[0][0]) throw 403

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            const _user = {
                email: user.email,
                id: user.id,
            }
            req.cookies.token = jwt.sign(_user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            return _user
        });

    }
    catch (err) {
        if(err != 403)
            throw 500
        else
            throw 403
    }
}
const pool = require('../mysql/dbpool')

const allVacations = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const query =
        `SELECT * 
        FROM vacations`

    try {
        let mqRes = await pool.execute(query)
        let data = mqRes[0];

        response.data = mapUserData(data);
        response.success = true;
        code = 200;
    }
    catch (err) {
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}

const byID = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const id = req.params.id

    const query =
        `SELECT * 
        FROM vacations
        WHERE id = ?
        LIMIT 1`

    try {
        let mqRes = await pool.execute(query, [id])
        let data = mqRes[0];

        response.data = mapUserData(data);
        response.success = true;
        code = 200;
    }
    catch (err) {
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}

module.exports = {
    allVacations,
    byID,

}
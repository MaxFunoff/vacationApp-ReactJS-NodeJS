const pool = require('../mysql/dbpool')

const allVacations = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const query =
        `SELECT id, name, description, DATE_FORMAT(start_date, "%d/%m/%Y") as StartDate, DATE_FORMAT(end_date, "%d/%m/%Y") as EndDate, price, picture 
        FROM vacations`

    try {
        let mqRes = await pool.execute(query)

        response.data = mqRes[0];
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
        `SELECT id, name, description, DATE_FORMAT(start_date, "%d/%m/%Y") as StartDate, DATE_FORMAT(end_date, "%d/%m/%Y") as EndDate, price, picture 
        FROM vacations
        WHERE id = ?
        LIMIT 1`

    try {
        let mqRes = await pool.execute(query, [id])

        response.data = mqRes[0];
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
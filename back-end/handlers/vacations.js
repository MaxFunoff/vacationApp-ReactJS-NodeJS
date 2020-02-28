const pool = require('../mysql/dbpool')

const allVacations = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const query =
        `SELECT id, name, description, DATE_FORMAT(start_date, "%Y-%m-%d") as StartDate, DATE_FORMAT(end_date, "%Y-%m-%d") as EndDate, price, image 
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
        `SELECT id, name, description, DATE_FORMAT(start_date, "%Y-%m-%d") as StartDate, DATE_FORMAT(end_date, "%Y-%m-%d") as EndDate, price, image 
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

const createVacation = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 401;
    // if(req.user.type != 'admin') return res.status(code).json(response)
    const fileLocation = req.file ? 'http://localhost:3000/uploads/' + req.file.filename : null;
    const vacation = [req.body.name, req.body.description, req.body.StartDate, req.body.EndDate, req.body.price, fileLocation];

    console.log(req.body)
    const query = 
    `INSERT INTO vacations(name, description, start_date, end_date, price, image) 
    VALUES (?, ?, ?, ?, ?, ?)`

    try {
        let mqRes = await pool.execute(query, vacation)

        response.data = mqRes[0];
        response.success = true;
        code = 201;
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
    createVacation,
}
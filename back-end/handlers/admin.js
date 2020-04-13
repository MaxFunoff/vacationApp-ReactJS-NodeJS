const pool = require('../mysql/dbpool')

const createVacation = async (req, res) => {
    let response = {
        data:{},
        success: false,
    }
    let code = 401;

    const fileLocation = req.file ? 'http://localhost:8000/uploads/' + req.file.filename : null;
    const vacation = [req.body.name, req.body.description, req.body.StartDate, req.body.EndDate, req.body.price, fileLocation, req.body.available];

    const query =
        `INSERT INTO vacations(name, description, start_date, end_date, price, image, available) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`

    try {
        const mqRes = await pool.execute(query, vacation);
        console.log(mqRes[0].insertId)
        response.data.newId = mqRes[0].insertId
        response.success = true;
        code = 201;
    }
    catch (err) {
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)

}

const getStats = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 401;

    const query =
        `SELECT v.name as 'VacationName', COUNT(utv.vacation_id) as OrderCount FROM vacations v LEFT JOIN users_to_vacations utv ON v.id = utv.vacation_id
        GROUP BY v.id`

    try {
        const mqRes = await pool.execute(query)

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

const getVacations = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const query =
        `SELECT id, name, description, DATE_FORMAT(start_date, "%Y-%m-%d") as StartDate, DATE_FORMAT(end_date, "%Y-%m-%d") as EndDate, price, available
        FROM vacations v
        ORDER BY id ASC`

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

const getVacationsByID = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    const id = req.params.id;
    const query =
        `SELECT id, name, description, DATE_FORMAT(start_date, "%Y-%m-%d") as StartDate, DATE_FORMAT(end_date, "%Y-%m-%d") as EndDate, price, available
        FROM vacations v
        WHERE id = ?
        LIMIT 1`

    try {
        let mqRes = await pool.execute(query, [id])

        response.data = mqRes[0];
        response.success = true;
        code = 200;
    }
    catch (err) {
        console.log(err)
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}

const updateVacation = async (req, res) => {
    
    let response = {
        success: false,
    }
    let code = 500;
    const vacation = [req.body.name, req.body.description, req.body.StartDate, req.body.EndDate, req.body.price, req.body.available, req.params.id];
    const query =
        `UPDATE vacations v SET 
        name=?,
        description=?,
        start_date=?,
        end_date=?,
        price=?,
        available=?
        WHERE v.id = ?`

    try {
        await pool.execute(query, vacation)
        response.success = true;
        code = 200;
    }
    catch (err) {
        console.log(err)
        response.err = err;
        code = 500;
    }

    res.status(code).json(response)
}

/* Add more functions */

module.exports = {
    createVacation,
    getStats,
    getVacations,
    updateVacation,
    getVacationsByID,
}
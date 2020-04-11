const pool = require('../mysql/dbpool')

const createVacation = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 401;

    const fileLocation = req.file ? 'http://localhost:3000/uploads/' + req.file.filename : null;
    const vacation = [req.body.name, req.body.description, req.body.StartDate, req.body.EndDate, req.body.price, fileLocation];

    const query =
        `INSERT INTO vacations(name, description, start_date, end_date, price, image) 
        VALUES (?, ?, ?, ?, ?, ?)`

    try {
        await pool.execute(query, vacation)

        response.data = 'Vacation created succesfully';
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
        `SELECT v.name as 'VacationName', COUNT(v.id) as OrderCount FROM vacations v LEFT JOIN users_to_vacations utv ON v.id = utv.vacation_id
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

/* Add more functions */

module.exports = {
    createVacation,
    getStats,
}
const pool = require('../mysql/dbpool')

const allVacations = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const query =
        `SELECT id, name, description, DATE_FORMAT(start_date, "%Y-%m-%d") as StartDate, DATE_FORMAT(end_date, "%Y-%m-%d") as EndDate, price, image 
        FROM vacations
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

const addVacationToUser = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    const userID = req.user.id;
    const vacationID = req.params.id;
    const specialID = userID.toString() + '$' + vacationID.toString();

    const query =
        `INSERT INTO users_to_vacations(id, user_id, vacation_id)
        VALUES (?, ?, ?)`

    try {
        await pool.execute(query, [specialID, userID, vacationID])
        response.success = true;
        response.data = 'Vacation added to user succesfully'
        code = 201;
    }
    catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            code = 409;
            response.err = 'Vacation already assigned to user'
        } else {
            code = 500;
            response.err = 'Please try again later'
        }
    }
    res.status(code).json(response)
}

const removeVacationFromUser = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    const userID = req.user.id;
    const vacationID = req.params.id;
    const specialID = userID.toString() + '$' + vacationID.toString();

    const query =
        `UPDATE users_to_vacations SET status='pending refund' WHERE id = ?`

    try {
        await pool.execute(query, [specialID])
        response.success = true;
        response.data = 'Refund for vacations has been issued'
        code = 202;
    }
    catch (err) {
        code = 500;
        response.err = 'Please try again later'
    }
    res.status(code).json(response)
}

module.exports = {
    allVacations,
    byID,
    createVacation,
    addVacationToUser,
    removeVacationFromUser,
}
require('dotenv').config()
const pool = require('../mysql/dbpool')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10;

const allUsers = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;

    const adminContent = req.user.type === 'admin' ? `, v.id as vacationId,
    v.name as vacationName,
    v.image as vacationImage,
    utv.status as status,
    DATE_FORMAT(utv.status_change_date, '%Y-%m-%d %H:%i') as lastChanged ` : '';

    const query =
        `SELECT u.id as userId, u.email as userEmail, utv.user_id as vUserId ${adminContent} 
    FROM users u 
    LEFT JOIN users_to_vacations utv 
    ON u.id = utv.user_id 
    LEFT JOIN vacations v 
    ON v.id = utv.vacation_id 
    ORDER BY u.id ASC`


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

    let code = 401;

    const id = req.params.id != 'profile' ? req.params.id : req.user.id;

    const adminContent = req.user.type === 'admin' || id === req.user.id ?
        `, v.id as vacationId,
    v.name as vacationName,
    v.image as vacationImage,
    utv.status as status,
    DATE_FORMAT(utv.status_change_date, '%Y-%m-%d %H:%i') as lastChanged ` : '';

    const query =
        `SELECT u.id as userId, u.email as userEmail, utv.user_id as vUserId ${adminContent}
    FROM users u 
    LEFT JOIN users_to_vacations utv 
    ON u.id = utv.user_id 
    LEFT JOIN vacations v 
    ON v.id = utv.vacation_id 
    WHERE u.id = ?`

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

const registerUser = async (req, res) => {
    let response = {
        success: false,
    }

    let code = 500;

    let user = req.body;

    if (user.email == undefined || user.password == undefined) {
        response.err = 'Bad Parameters';
        code = 400;
        res.status(code).json(response);
    }
    else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;

        let query =
            `INSERT INTO users(email, password)
            VALUES (?, ?)`

        try {
            await pool.execute(query, [user.email, user.password])
            response.success = true;
            response.data = 'User created succesfully';
            code = 200;
        }
        catch (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                code = 409;
                response.err = 'Email already exists'
            } else {
                code = 500;
                response.err = 'Please try again later'
            }
        }

        res.status(code).json(response)
    }
}

const loginUser = async (req, res) => {
    let response = {
        success: false,
    }
    let code = 500;
    let user = req.body;

    let query =
        `SELECT * 
        FROM users
        WHERE email = ?`

    let mqRes;
    try {
        mqRes = await pool.execute(query, [user.email])
    }
    catch (err) {
        code = 500;
        response.err = 'Please try again later'
    }

    const match = await bcrypt.compare(user.password, mqRes[0][0].password)

    if (match) {
        let user = {
            email: mqRes[0][0].email,
            id: mqRes[0][0].id,
            type: mqRes[0][0].type,
        }
        let accessToken = await generateToken(user);
        let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

        query =
            `INSERT INTO tokens(token)
        VALUES (?)`
        try {
            await pool.execute(query, [refreshToken])
            response.data = user;
            res.cookie('access-token', accessToken, { maxAge: (60 * 30 * 24 * 7), httpOnly: true});
            res.cookie('refresh-token', refreshToken, { maxAge: (60 * 60 * 24 * 7), httpOnly: true});
            response.success = true;
            code = 200;
        }
        catch (err) {
            code = 500;
            response.err = 'Please try again later'
        }
    } else {
        code = 401
        response.err = 'Email or password is incorrect'
    }

    res.status(code).json(response)
}



const logOut = async (req, res) => {

    let response = {
        success: false
    }

    let refreshToken = req.body.token
    if (!refreshToken) return res.status(400).json(response)

    const query =
        `DELETE
    FROM tokens
    WHERE token = ?`


    try {
        await pool.execute(query, [refreshToken])
        response.success = true
        res.clearCookie('token').clearCookie('refresh-token').status(200).json(response)
    }
    catch (err) {
        res.status(500).json(response)
    }
}


/*Access Token Generation*/
const generateToken = async (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}


/* Map Data For Users*/
const mapUserData = (data) => {
    let users = [];
    data.map(item => {
        let indexUser = users.findIndex(user => user.Id == item.userId);
        if (indexUser == -1) {

            let _user = {
                Id: item.userId,
                Email: item.userEmail,
            }
            let _vacation = checkVacation(item);
            if (_vacation != null)
                _user.Vacations = [_vacation]


            users.push(_user)

        } else {
            let _vacation = checkVacation(item);
            if(_vacation != null && users[indexUser].Vacations)
                users[indexUser].Vacations.push(_vacation); 
            if(_vacation != null && !users[indexUser].Vacations)
                users[indexUser].Vacations = [_vacation]
        }
    });

    return users
}

/*Check Vacations*/
const checkVacation = (item) => {
    if (item.vacationId == null) return;
    const vacation = { id: item.vacationId, Name: item.vacationName, Image: item.vacationImage, Status: item.status, lastStatusChange: item.lastChanged }
    return (vacation)
}

module.exports = {
    allUsers,
    byID,
    registerUser,
    loginUser,
    logOut,
}



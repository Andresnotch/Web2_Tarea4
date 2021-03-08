const {Pool} = require('pg');
const animal_data = require('./data/animal_data.json');

const pool = new Pool({
    user: 'postgres',
    host: process.env.DBHOST,
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

async function getAllAnimals() {
    try {
        await pool.connect()
        const res = await pool.query('SELECT * FROM ANIMALS')
        return res.rows
    } catch (error) {
        return animal_data.slice(0, 20)
    }
}

async function getAllAnimalsWithUser() {
    try {
        await pool.connect()
        const res = await pool.query('SELECT ID, ANIMALNAME, BREEDNAME, SPECIESNAME, ANIMALAGE, BASECOLOUR, NAME AS OWNER \
                                    FROM ANIMALS A, USERS U WHERE A.USER_ID = U.USER_ID')
        return res.rows
    } catch (error) {
        return animal_data.slice(0, 20)
    }
}

async function getAnimalById(id) {
    try {
        await pool.connect()
        const query = {
            text: 'SELECT * FROM ANIMALS WHERE ID = $1',
            values: [id]
        }
        const res = await pool.query(query);
        return res.rows[0]
    } catch (error) {
        return {}
    }
}

async function insertAnimal(newAnimal) {
    try {
        await pool.connect()
        const insert = {
            text: 'INSERT INTO ANIMALS (ANIMALNAME, ANIMALAGE, BREEDNAME, SPECIESNAME, BASECOLOUR) VALUES ($1,$2,$3,$4,$5) RETURNING ID',
            values: [
                newAnimal.animalsname,
                newAnimal.animalsage,
                newAnimal.breedname,
                newAnimal.speciesname,
                newAnimal.basecolour
            ]
        }
        const res = await pool.query(insert);
        return res
    } catch (error) {
        return ""
    }
}

async function updateAnimal(id, animal) {
    try {
        await pool.connect()
        const update = {
            text: 'UPDATE ANIMALS SET (ANIMALNAME, ANIMALAGE, BREEDNAME, SPECIESNAME, BASECOLOUR) = ($1,$2,$3,$4,$5) WHERE ID = $6 RETURNING ID, ANIMALNAME, ANIMALAGE, BREEDNAME, SPECIESNAME, BASECOLOUR',
            values: [
                animal.animalsname,
                animal.animalsage,
                animal.breedname,
                animal.speciesname,
                animal.basecolour,
                id
            ]
        }
        const res = await pool.query(update);
        return res
    } catch (error) {
        return ""
    }
}

async function deleteAnimal(id) {
    await pool.connect();
    const back = await pool.query('SELECT ID, ANIMALNAME, BREEDNAME, SPECIESNAME, ANIMALAGE, BASECOLOUR, NAME AS OWNER \
                                FROM ANIMALS A, USERS U WHERE A.USER_ID = U.USER_ID');
    const del = {
        text: 'DELETE FROM ANIMALS WHERE ID = $1 RETURNING ID, ANIMALNAME, ANIMALAGE, BREEDNAME, SPECIESNAME, BASECOLOUR, user_id',
        values: [id]
    }
    try {
        const res = await pool.query(del);
        return back;
    } catch (error) {
        return error;
    }
}

async function getAllUsers() {
    await pool.connect()
    const query = {
        text: 'SELECT * FROM USERS'
    };
    const res = await pool.query(query);
    return res.rows;
}

async function insertUser(newUser) {
    await pool.connect()
    const insert = {
        text: 'INSERT INTO USERS (NAME, AGE) VALUES ($1,$2) RETURNING *',
        values: [
            newUser.name,
            newUser.age
        ]
    }
    const res = await pool.query(insert);
    return res
}

async function updateUser(id, user) {
    await pool.connect()
    const update = {
        text: 'UPDATE USERS SET (NAME, AGE) = ($1, $2) WHERE USER_ID = $3 RETURNING *',
        values: [
            user.name,
            user.age,
            id
        ]
    }
    const res = await pool.query(update);
    return res
}

async function deleteUser(id) {
    await pool.connect()
    const query = {
        text: 'SELECT * FROM USERS WHERE USER_ID = $1',
        values: [id]
    };
    const back = await pool.query(query)
    const del = {
        text: 'DELETE FROM USERS WHERE USER_ID = $1 RETURNING *',
        values: [id]
    }
    const delAnimal = {
        text: 'UPDATE ANIMALS SET (USER_ID) = (NULL) WHERE USER_ID = 1 RETURNING *',
        values: [
            id
        ]
    }
    try {
        const res = await pool.query(del);
        const resp = await pool.query(delAnimal);
        return res;
    } catch (error) {
        return error;
    }
    
}

module.exports = {
    getAllAnimals,
    getAllAnimalsWithUser,
    getAnimalById,
    insertAnimal,
    updateAnimal,
    deleteAnimal,
    getAllUsers,
    insertUser,
    updateUser,
    deleteUser
};
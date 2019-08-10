const express = require('express');
const router = express.Router();
const pg = require('pg');

const Pool = pg.Pool;
const pool = new Pool({
	database: 'DTD_To_Do_List',
	host: 'localhost',
	port: 5432,
	max: 15,
	idleTimeoutMillis: 20000
});

module.exports = router;

//get all tasks from database
router.get('/', (req, res) => {
	let queryText = `SELECT * FROM "tasks";`;
	pool
		.query(queryText)
		.then(result => {
			console.log('successful GET request from database');
			res.send(result.rows);
		})
		.catch(err => {
			console.log('error on database GET request: ', err);
			res.sendStatus(500);
		});
});

//post new task to database
router.post('/', (req, res) => {
	let newTask = req.body;
	let queryText = `INSERT INTO "tasks" ("name", "details")
                    VALUES ($1, $2);`;
	let values = [newTask.name, newTask.details];
	pool
		.query(queryText, values)
		.then(result => {
			console.log('successful POST request to database');
			res.sendStatus(201);
		})
		.catch(err => {
			console.log('error on database POST request: ', err);
			res.sendStatus(500);
		});
});

//delete tasks from database
router.delete('/:id', (req, res) => {
	let taskId = req.params.id;
	let queryText = `
		DELETE FROM "tasks"
		WHERE "id" = $1;
		`;
	pool
		.query(queryText, [taskId])
		.then(result => {
			console.log('successful DELETE request to database');
			res.sendStatus(204);
		})
		.catch(err => {
			console.log('error on DELETE request to database: ', err);
			res.sendStatus(500);
		});
});

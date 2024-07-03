import database from '../config/mysql.config.js';
import Response  from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/patient.query.js';

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' },
};

export const index = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patients`);
    database.query(QUERY.SELECT_PATIENTS, (error, results) => {
        if (!results) {
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.NO_CONTENT, 'No patients found'));
        } else {
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK, 'Patients found', { patients: results }));
        }
    });
}

export const show = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patient`);
    database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
        if (!results) {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND, 'No patient found'));
        } else {
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK, 'Patient found', { patient: results[0] }));
        }
    });
}

export const store = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, creating patient`);
    database.query(QUERY.CREATE_PATIENT, Object.values(req.body), (error, results) => {
        if (!results) {
            logger.error(error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred'));
        } else {
            const patient = { id: results.insertedId, ...req.body, createdAt: new Date() };
            res.status(HttpStatus.CREATED.code)
                .send(new Response(HttpStatus.CREATED, 'Patient created', { patient }));
        }
    });
}

export const update = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patient`);
    database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
        if (!results[0]) {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND, 'No patient found'));
        } else {
            logger.info(`${req.method} ${req.originalUrl}, updating patient`);
            database.query(QUERY.UPDATE_PATIENT, [...Object.values(req.body), req.params.id], (error, results) => {
                if (!error) {
                    res.status(HttpStatus.OK.code)
                        .send(new Response(HttpStatus.OK, 'Patient updated', { id: req.params.id, ...req.body }));
                } else {
                    logger.error(error.message);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred'));
                }
            });
        }
    });
}

export const remove = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, deleting patient`);
    database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
        if (results.affectedRows > 0) {
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK, 'Patient deleted', results[0]));
        } else {
            res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND, 'No patient found'));
        }
    });
}

export default HttpStatus;


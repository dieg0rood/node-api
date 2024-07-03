import express from 'express';
import { index, store, show, remove, update } from '../controller/patient.controller.js';

const router = express.Router();

router.route('/')
    .get(index)
    .post(store);

router.route('/:id')
    .get(show)
    .put(update)
    .delete(remove);

export default router;
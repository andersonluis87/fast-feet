import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import ProblemController from './app/controllers/ProblemController';

import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

/**
 * Authentication
 */
routes.post('/sessions', SessionController.store);

/**
 * Orders (Deliveryman Acesss)
 * TODO: create authentication by Deliveryman
 */
routes.get('/deliveryman/:id/orders', DeliveryController.index);
routes.put('/deliveryman/:id/orders/:order_id', DeliveryController.update);

/**
 * Order Problems
 */
routes.put('/orders/:id/problems', ProblemController.update);

/**
 * Token required for next routes from here
 */
routes.use(authMiddleware);

/**
 * Recipients
 */
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

/**
 * Deliveryman
 */
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

/**
 * Orders (Admin access)
 */
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

/**
 * File upload
 */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;

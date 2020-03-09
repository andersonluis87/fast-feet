import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

/**
 * Authentication
 */
routes.post('/sessions', SessionController.store);

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
 * Deliverymen
 */
routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

/**
 * Orders
 */
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);

/**
 * File upload
 */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;

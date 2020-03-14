import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import OrderCreatedEmail from '../jobs/OrderCreatedMail';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const orders = await Order.findAll({
      order: ['created_at'],
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'nome',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
            'endereco',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Schema!' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    /**
     * Get Recipient
     */
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    /**
     * Get Deliveryman
     */
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    const order = await Order.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    const orderMailData = {
      product,
      deliveryman,
      recipient,
    };

    await Queue.add(OrderCreatedEmail.key, {
      orderMailData,
    });

    return res.status(201).json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
    });

    if (!(await schema.isValid())) {
      return res.status(400).json({ error: 'Invalid schema' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    const {
      id,
      product,
      recipient_id,
      deliveryman_id,
      createdAt,
      updatedAt,
    } = await order.update(req.body);

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
      createdAt,
      updatedAt,
    });
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    await order.destroy();

    return res.json({ message: 'Order removed successfully' });
  }
}

export default new OrderController();

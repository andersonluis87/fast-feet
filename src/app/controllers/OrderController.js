import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import OrderCreatedEmail from '../jobs/OrderCreatedMail';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class OrderController {
  /**
   * start_date deve ser preenchida no momento de retirada do entregador
   * end_date deve ser preenchida no momento da entrega
   * recipient_id e deliveryman_id são obrigatórios no momento de criação da encomenda
   * enviar email ao cadastrar o entregador
   *
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const orders = await Order.findAll({
      order: ['created_at'],
      attributes: ['product', 'start_date', 'end_date', 'canceled_at'],
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
      deliveryman: deliveryman.toJSON(),
      recipient: recipient.toJSON(),
    };

    console.log(orderMailData);

    await Queue.add(OrderCreatedEmail.key, {
      orderMailData,
    });

    return res.status(201).json(order);
  }
}

export default new OrderController();

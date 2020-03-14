import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const { id } = req.params;
    const { delivered = false } = req.query;

    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    /**
     * Conditional Where Clause: Check if the request parameter delivered is true
     */
    const isDelivered = delivered === 'true';
    const whereCondition = isDelivered
      ? {
          deliveryman_id: id,
          canceled_at: null,
          end_date: { [Op.not]: null },
        }
      : { deliveryman_id: id, canceled_at: null, end_date: null };

    const order = await Order.findAll({
      attributes: ['id', 'product', 'createdAt'],
      where: whereCondition,
      include: [
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
      ],
    });

    return res.json(order);
  }

  async update(req, res) {
    return res.json({});
  }
}

export default new DeliveryController();

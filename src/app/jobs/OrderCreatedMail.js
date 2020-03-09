import Mail from '../../lib/Mail';

class OrderCreatedMail {
  get key() {
    return 'OrderCreatedMail';
  }

  async handle({ data }) {
    const { orderMailData: order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Nova entrega disponível',
      template: 'order',
      context: {
        deliveryman: order.deliveryman.name,
        recipient: order.recipient.nome,
        product: order.product,
        rua: order.recipient.rua,
        numero: order.recipient.numero,
        complemento: order.recipient.complemento,
        cidade: order.recipient.cidade,
        estado: order.recipient.estado,
        cep: order.recipient.cep,
      },
    });
  }
}

export default new OrderCreatedMail();

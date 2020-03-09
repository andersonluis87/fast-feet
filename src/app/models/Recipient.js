import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        rua: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        complemento: Sequelize.STRING,
        estado: Sequelize.STRING,
        cidade: Sequelize.STRING,
        cep: Sequelize.STRING,
        endereco: {
          type: Sequelize.VIRTUAL,
          get() {
            return [
              this.rua,
              this.numero,
              this.complemento,
              this.estado,
              this.cidade,
              this.cep,
            ].join(', ');
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Recipient;

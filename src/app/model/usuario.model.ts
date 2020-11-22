export class Usuario {
  _id: string;
  ativo: boolean;
  tipo: string;
  nome: string;
  email: string;
  senha: string;
  facebook: boolean;
  bloco: string;
  numeroApartamento;
  
  constructor() {
    this.facebook = false;
  }
}

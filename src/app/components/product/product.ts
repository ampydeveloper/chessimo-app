export default class Product {

    name: string;
    description: string;
    price: string;
    image: string;
    owned: any;
    id: string;
    alias: string;
    type: string;

    constructor(p) {
      Object.assign(this, p);
    }

    order(product) {
      console.log('Start order', product);
    }
}
  
import {ClientsModel} from './Clients.Model';
import {ProductItem} from './ProductItem';
import {PaymentModel} from './payment.model';

export class OrderModel {
  id:number;
  client:ClientsModel={name:"",address:"",phoneNumber:"",email:"",username:""};
  payment:PaymentModel;
  products:ProductItem[]=[];
  totalAmount:number;
  date:Date;
  _links: {
    self: {
      href: string;
    },
    order: {
      href: string;
    },
    payment: {
      href: string;
    },
    client: {
      href: string;
    },
    orderItems: {
      href: string;
    }
  }
}

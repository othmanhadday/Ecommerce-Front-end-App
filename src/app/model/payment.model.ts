import {OrderModel} from './Order.model';

export class PaymentModel {
  public id:number;
  public cardNumber:number;
  public cardType:string;
  public order:OrderModel=new OrderModel();
}

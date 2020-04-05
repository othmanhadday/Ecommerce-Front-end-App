import {ClientsModel} from './Clients.Model';
import {ProductItem} from './ProductItem';

export class CaddyModel {
  public items:Map<number, ProductItem>=new Map();
  public client:ClientsModel;
}

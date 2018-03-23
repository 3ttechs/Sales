import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ShoppingCartProvider } from '../../providers/shopping-cart/shopping-cart';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  loading: any;
  private shoppingList: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private shoppingCart: ShoppingCartProvider,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    //this.getItemsFromCart();
  }

  ionViewDidEnter() {
    this.getItemsFromCart();
  }

  getItemsFromCart(){
    this.loading = this.loadingCtrl.create({
      content: 'Fetching Cart Items...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.getItemsFromCart().then(result => {
        this.shoppingList = result["items"];
        console.log(result["items"]);
      }).catch(err=>console.log(err));
      this.loading.dismiss();
    });
  }

  removeFromCart($event,cartItem){
    console.log(cartItem);
    //TODO: implement delete item code
    //find array matching typescript and remove it from shoppingList
  }

}

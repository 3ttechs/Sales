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
        console.log(this.shoppingList);
      }).catch(err=>console.log(err));
      this.loading.dismiss();
    });
  }

  //Need to discuss this logic. Can either wait for hard delete from storage and pull latest records or do soft delete and later delete from storage
  removeFromCart($event,cartItem){
    this.loading = this.loadingCtrl.create({
      content: 'Fetching Cart Items...'
    });

    //Removing local cashed copy to reflect the change immediatly.
    var filteredShoppingList: any;
    filteredShoppingList = this.shoppingList.filter(function(emp) {
      if (emp.productCode == cartItem.productCode) { //if same item is added multiple times, both will get deleted together
          return false;
      }
      return true;
    });
    this.shoppingList = filteredShoppingList;
    
    //Removing from the storage for permanent removal.
    this.loading.present().then(()=>{
      this.shoppingCart.removeItemFromCart(filteredShoppingList).then(result => {
        //this.shoppingList = filteredShoppingList;  //Need to do this??
      }).catch(err=>console.log(err));
      this.loading.dismiss();
    });
  }
}

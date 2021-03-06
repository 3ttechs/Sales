import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.getItemsFromCart();
  }

  ionViewWillLeave(){
    if(this.shoppingList)
    this.shoppingList.forEach(element => {
      element.Vat = Number(element.price) * Number(element.qty) * 0.05;
      element.amount = Number(element.price) * Number(element.qty);
      if(element.amount < 0)
      {
        element.qty = 0;
        element.discount = 0;
        element.amount = 0;
        element.Vat = 0;
      }
    });
    this.UpdateCart();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid entries!',
      subTitle: 'Invalid Values, please correct.',
      buttons: ['OK']
    });
    alert.present();
  }


  getItemsFromCart(){
    this.loading = this.loadingCtrl.create({
      //content: 'Fetching Cart Items...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.getItemsFromCart().then(result => {
        this.shoppingList = result["items"];
      }).catch(err=>console.log(err));
      this.loading.dismiss();
    });
  }

  //Need to discuss this logic. Can either wait for hard delete from storage and pull latest records or do soft delete and later delete from storage
  removeFromCart($event,cartItem){
    this.loading = this.loadingCtrl.create({
      //content: 'Fetching Cart Items...'
    });

    //Removing local cashed copy to reflect the change immediatly.
    var filteredShoppingList: any;
    filteredShoppingList = this.shoppingList.filter(function(emp) {
      if (emp.code == cartItem.code) { //if same item is added multiple times, both will get deleted together
          return false;
      }
      return true;
    });
    //console.log(filteredShoppingList);
    this.shoppingList = filteredShoppingList;
    
    //Removing from the storage for permanent removal.
    this.loading.present().then(()=>{
      this.shoppingCart.removeItemFromCart(filteredShoppingList).then(result => {
        //this.shoppingList = filteredShoppingList;  //Need to do this??
      }).catch(err=>console.log(err));
      this.loading.dismiss();
    });
  }

  UpdateCart(){
    this.loading = this.loadingCtrl.create({
      //content: 'Updating Cart Items...'
    });

    //We are replacing storage cart item with the updated cart item
    this.loading.present().then(()=>{
      this.shoppingCart.removeItemFromCart(this.shoppingList).then(result => {
      }).catch(err=>console.log(err));
      this.loading.dismiss();
    });
  }
}

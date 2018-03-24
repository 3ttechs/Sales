import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ShoppingCartProvider } from '../../providers/shopping-cart/shopping-cart';
import { CategoriesPage } from '../categories/categories';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  loading: any;
  private shoppingList: any;

  private subTotal: number=256.05;
  private VAT: number=12.56;
  private discount: number=0;
  private total: number=268.61;
  private paymentMode: string="Cash";
  //private summaryItem: {SubTotal:0, VAT:0, Discount:0, Total:0, PaymentMode:'', CustName:'', CustPhone:''};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private shoppingCart: ShoppingCartProvider,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
    //this.calculateSummary();
  }

  calculateSummary(){
    this.loading = this.loadingCtrl.create({
      content: 'Calculating totals...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.getItemsFromCart().then(result => {
        console.log(result["items"]);
        this.shoppingList = result["items"];
        console.log(result["items"]);
      }).catch(err=>console.log(err));

      this.shoppingList.array.forEach(element => {
        this.subTotal += Number(element.price);
      });

      this.VAT = Number(this.subTotal) * Number("0.05");

      this.loading.dismiss();
    });
  }
  
  PlaceOrder(){
    this.loading = this.loadingCtrl.create({
      content: 'Placing order...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.placeOrder().then(result => {
        this.showAlert();
      }).catch(err=>console.log(err));
      this.loading.dismiss();
      this.navCtrl.setRoot(CategoriesPage);
    });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      //title: 'Login Error!',
      subTitle: 'Order Placed. Receipt number : 16589',
      buttons: ['OK']
    });
    alert.present();
  }
}

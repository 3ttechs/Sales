import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ShoppingCartProvider } from '../../providers/shopping-cart/shopping-cart';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  loading: any;
  private shoppingList: any;

  private subTotal: number=0;
  private VAT: number=0;
  private discount: number=0;
  private total: number=0;
  private paymentMode: string;
  //private summaryItem: {SubTotal:0, VAT:0, Discount:0, Total:0, PaymentMode:'', CustName:'', CustPhone:''};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private shoppingCart: ShoppingCartProvider,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SummaryPage');
  }

  ionViewDidEnter() {
    this.calculateSummary();
  }

  calculateSummary(){
    this.loading = this.loadingCtrl.create({
      content: 'Calculating totals...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.getItemsFromCart().then(result => {
        this.shoppingList = result["items"];

        this.subTotal = 0;

        this.shoppingList.forEach(element => {
          this.subTotal += (Number(element.price) * Number(element.qty) - Number(element.discount));
        });

        this.VAT = Number(this.subTotal) * Number("0.05");
        this.total = this.subTotal + this.VAT- this.discount;

      }).catch(err=>console.log(err));

      this.loading.dismiss();
    });
  }

  PlaceOrder(){
    this.loading = this.loadingCtrl.create({
      content: 'Placing order...'
    });

    console.log(this.discount);

    this.loading.present().then(()=>{
      //this.shoppingCart.placeOrder().then(result => {
      //  this.showAlert();
      //}).catch(err=>console.log(err));
      this.loading.dismiss();
      //this.navCtrl.setRoot(CategoriesPage);
    });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Order Placed. Invoice number : 16589',
      buttons: ['OK']
    });
    alert.present();
  }
}

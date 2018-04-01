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
  
  private summaryItem: {
    "invoice": {
      "id": 2,
      "sales_person_code": "ASDF",
      "customer_name": "ABC Corp.",
      "customer_phone": "99-99-99",
      "customer_vat_no": "00-00",
      "sub_total": 0.02,
      "discount": 0.02,
      "vat": 0.02,
      "total": 25,
      "payment_mode": 1,
      "status": 1,
      "notes": "-"
      },
    "items": [
      {
        "id": 1,
        "product_code": "1",
        "product_category": "Floral",
        "product_name": "Diasy",
        "product_name_arabic": "Diasy",
        "product_brand": "Diasy",
        "product_type": "Diasy",
        "product_coo": "India",
        "product_price": 2.54,
        "quantity": 12,
        "vat": 1.0,
        "discount": 0.02,
        "amount": 25
      },
      {
        "id": 2,
        "product_code": "1",
        "product_category": "Floral",
        "product_name": "Diasy",
        "product_name_arabic": "Diasy",
        "product_brand": "Diasy",
        "product_type": "Diasy",
        "product_coo": "India",
        "product_price": 2.54,
        "quantity": 12,
        "vat": 1.0,
        "discount": 0.02,
        "amount": 25
      }
    ]
  };

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

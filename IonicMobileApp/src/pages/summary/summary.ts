import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ShoppingCartProvider } from '../../providers/shopping-cart/shopping-cart';
import { WebServicesProvider } from '../../providers/web-services/web-services';
import { CategoriesPage } from '../categories/categories';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  loading: any;
  private shoppingList: any;

  private summaryPageObject = {subTotal:0,VAT:0,Discount:0,Total:0};
  //private subTotal: number=0;
  //private VAT: number=0;
  //private discount: number=0;
  //private total: number=0;
  private customerName: string='';
  private customerPhone: string='';
  private customerVatNo: string='';
  private paymentMode: string="1";
  private customerNotes: string='';
  private invoiceNumber: string;
  private userName = '';
  
  private summaryItem = {
    invoice: {
      id: 0,
      sales_person_code: '',
      customer_name: '',
      customer_phone: '',
      customer_vat_no: '',
      sub_total: 0,
      discount: 0,
      vat: 0,
      total: 0,
      payment_mode: 1,
      status: 1,
      notes: "-"
      },
    items: []
  };

  private summarySubItem = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private shoppingCart: ShoppingCartProvider,
    public webService: WebServicesProvider, 
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.userName = localStorage.getItem("user");
  }

  //Event that gets triggered every time user enters the page
  ionViewDidEnter() {
    this.calculateSummary();
  }

  //if non selected, disable the add to cart button
  noneSelected(){
    if(this.summaryPageObject.subTotal == 0)
      return true;
    else
      return false;
  }


  calculateSummary(){
    this.loading = this.loadingCtrl.create({
      content: 'Calculating totals...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.getItemsFromCart().then(result => {
        this.shoppingList = result["items"];

        this.summaryPageObject.subTotal = 0;
        this.summaryPageObject.VAT = 0;
        this.summarySubItem = [];
		

        this.shoppingList.forEach(element => {
          this.summaryPageObject.subTotal += Number(element.amount);
          this.summaryPageObject.VAT += Number(element.Vat);
          this.summarySubItem.push({
            id: element.id,
            product_code: element.code,
            product_category: element.category,
            product_name: element.name,
            product_name_arabic: element.name,
            product_brand: element.brand,
            product_type: element.product_type,
            product_coo: element.coo,
            product_price: element.price,
            quantity: Number(element.qty),
            vat: Number(Number(element.price) * Number(element.qty) * 0.05),
            discount: Number(element.discount),
            amount: Number(element.amount)});
        });

        this.summaryItem.items = this.summarySubItem;

      }).catch(err=>console.log(err));

      this.loading.dismiss();
    });
  }

  PlaceOrder(){
    this.loading = this.loadingCtrl.create({
      content: 'Placing order...'
    });

    this.loading.present().then(()=>{
      this.summaryItem.invoice.sales_person_code = localStorage.getItem("user");
      this.summaryItem.invoice.customer_name = this.customerName;
      this.summaryItem.invoice.customer_phone = this.customerPhone;
      this.summaryItem.invoice.customer_vat_no = this.customerVatNo;
      this.summaryItem.invoice.sub_total = Number(this.summaryPageObject.subTotal);
      this.summaryItem.invoice.vat = Number(this.summaryPageObject.VAT);
      this.summaryItem.invoice.discount = Number(this.summaryPageObject.Discount);
      this.summaryItem.invoice.total = Number(Number(this.summaryPageObject.subTotal) - Number(this.summaryPageObject.Discount));
	  console.log(this.summaryItem.invoice.total);
      this.summaryItem.invoice.notes = this.customerNotes;
      this.summaryItem.invoice.payment_mode = Number(this.paymentMode);

      this.webService.placeOrder(this.summaryItem).then(result => {
        this.invoiceNumber = String(result);

        //Clear Cart Method
        this.shoppingCart.clearCart().then(result => {console.log(result);}).catch(err=>console.log(err));

        //Call the print method
        this.webService.printOrder(this.invoiceNumber).then(result =>{console.log(result);}).catch(err=>console.log(err));

        //Show the invoice number popup
        this.showAlert();

        this.loading.dismiss();

        this.navCtrl.parent.select(0);
      }).catch(err=>{console.log(err); this.loading.dismiss();});

      //to be removed
      this.shoppingCart.clearCart();

    });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Order Placed. Invoice number : ' + this.invoiceNumber,
      buttons: ['OK']
    });
    alert.present();
  }
}

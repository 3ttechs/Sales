import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';
import { WebServicesProvider } from '../../providers/web-services/web-services';
import { ShoppingCartProvider } from '../../providers/shopping-cart/shopping-cart';
import { AlertController } from 'ionic-angular';
import { CategoriesPage } from '../categories/categories';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {

  loading: any;
  public selectedProduct: {category:'',productCode:'', productName:''};;
  public selectedItem = {productCode:'',productName:'',category:'',price:'',qty:'', brand:'',amount:'',discount:''};
  public productDetails: any = {};

  constructor(public app: App, 
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController, 
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private shoppingCart: ShoppingCartProvider,
    public alertCtrl: AlertController) {
      this.selectedProduct = this.navParams.data;
  }

  ionViewDidLoad() {
    //this.getProductDetailsByCode();
  }

  getProductDetailsByCode(){
    this.loading = this.loadingCtrl.create({
      content: 'Fetching Product Details...'
    });

    this.loading.present().then(()=>{
      this.webService.getProductDetailsByCode(this.selectedProduct.productCode).then(result => {
        this.productDetails = result[0];
        console.log(result[0]);
        this.loading.dismiss();
      });
    });
  }

  addItemToCart(){
    this.selectedItem.productCode = this.selectedProduct.productCode;
    this.selectedItem.productName = this.selectedProduct.productName;
    this.selectedItem.category = this.selectedProduct.category;
    this.selectedItem.price = this.productDetails.price;
    this.selectedItem.brand = this.productDetails.brand;
    this.selectedItem.amount = String((Number(this.selectedItem.price) * Number(this.selectedItem.qty)) - Number(this.selectedItem.discount));

    this.loading = this.loadingCtrl.create({
      content: 'Adding item...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.addItemToCart(this.selectedItem);
      this.loading.dismiss();
      this.showAlert();
      this.navCtrl.setRoot(CategoriesPage);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  backToProducts(){
    this.navCtrl.pop();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      //title: 'Login Error!',
      subTitle: 'Item Added.',
      buttons: ['OK']
    });
    alert.present();
  }

}

import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';

import { WebServicesProvider } from '../../providers/web-services/web-services';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {

  loading: any;
  isLoggedIn: boolean = false;
  public products: any;

  selectedProduct: any;
  addProductData = {product:'',category:'',price:'',qty:''};

  constructor(public app: App, 
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController, 
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.doFetchAllProducts();
  }

  doFetchAllProducts() {
    this.loading = this.loadingCtrl.create({
      content: 'Fetching data...'
    });

    this.loading.present().then(()=>{
      this.webService.getAllProducts().then(result => {
        this.products = result;
        this.loading.dismiss();
      });
    });
  }

  doFetchProductList(){
    //TODO : Fetch a list of products starting with the typed characters
  }

  doFetchProductDetails(){
    //TODO : Fetch details of the selected product.
  }

  doAddProduct(){
    //Validate User here
    //alert(this.addProductData.product);
    //alert(this.addProductData.category);  
    //alert(this.addProductData.price);
    //alert(this.addProductData.qty);
    //TODO : Save all the values as an array object to be used in summary page.
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


}

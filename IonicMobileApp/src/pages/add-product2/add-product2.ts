import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';

import { WebServicesProvider } from '../../providers/web-services/web-services';


@Component({
  selector: 'page-add-product2',
  templateUrl: 'add-product2.html',
})
export class AddProduct2Page {

  loading: any;
  public products: any;

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

}

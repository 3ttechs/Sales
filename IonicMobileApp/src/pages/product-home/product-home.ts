import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController } from 'ionic-angular';
import { SummaryPage } from '../summary/summary';
import { LoginPage } from '../login/login';

import { WebServicesProvider } from '../../providers/web-services/web-services';
import { CategoriesPage } from '../categories/categories';
import { CartPage } from '../cart/cart';

@IonicPage()
@Component({
  selector: 'page-product-home',
  templateUrl: 'product-home.html',
})
export class ProductHomePage {

  loading: any;
  isLoggedIn: boolean = false;
  public productTab = CategoriesPage;
  public summaryTab = SummaryPage;
  public cartTab = CartPage;
  
  constructor(public app: App, public navCtrl: NavController, public webService: WebServicesProvider, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public navParams: NavParams) {
    if(!localStorage.getItem("token")) {
      navCtrl.setRoot(LoginPage);
    }
  }

  logout() {
    this.showLoader();
    this.webService.logout().then((result) => {
      this.loading.dismiss();
      let nav = this.app.getRootNav();
      nav.setRoot(LoginPage);
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });
    this.loading.present();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductHomePage');
  }

}

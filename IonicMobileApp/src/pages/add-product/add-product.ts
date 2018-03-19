import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';

import { WebServicesProvider } from '../../providers/web-services/web-services';
import { SummaryPage } from '../summary/summary';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {

  loading: any;
  addProductData = { product:'', category:'', price:'', qty:'' };
  isLoggedIn: boolean = false;

  constructor(public app: App, public navCtrl: NavController, public webService: WebServicesProvider, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    if(localStorage.getItem("token")) {
      this.isLoggedIn = true;
    }
  }

  doAddProduct(){
    //Validate User here
    alert(this.addProductData.product);
    alert(this.addProductData.category);  }

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
        content: 'Authenticating...'
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
    console.log('ionViewDidLoad AddProductPage');
  }

  ToSummary()
  {
    //Validate User here
    this.navCtrl.push(SummaryPage);
  }
}

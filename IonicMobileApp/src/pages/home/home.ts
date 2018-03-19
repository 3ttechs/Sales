import { Component } from '@angular/core';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';

import { WebServicesProvider } from '../../providers/web-services/web-services';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { AddProductPage } from '../add-product/add-product'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loading: any;
  isLoggedIn: boolean = false;

  constructor(public app: App, public navCtrl: NavController, public webService: WebServicesProvider, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    if(localStorage.getItem("token")) {
      this.isLoggedIn = true;
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

  NavigateToPurchase()
  {
    //Validate User here
    this.navCtrl.push(AddProductPage);
  }

}

import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { WebServicesProvider } from '../../providers/web-services/web-services';
import { ProductHomePage } from '../product-home/product-home';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: any;
  loginData = { login:'', password:'' };
  data: any;

  constructor(
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController, 
    private toastCtrl: ToastController,
    public alertCtrl: AlertController) {  
  }

  doLogin() {
    this.showLoader();
    this.webService.login(this.loginData).then((result) => {
      this.loading.dismiss();
      this.data = result;
      if(result ===1){
        localStorage.setItem('token', this.data);
        this.navCtrl.setRoot(ProductHomePage);
      }
      else{
        this.showAlert();
      }
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
      console.log('Toast Dismissed');
    });

    toast.present();
  }
  
  showAlert() {
    let alert = this.alertCtrl.create({
      //title: 'Login Error!',
      subTitle: 'Wrong Login or Password.',
      buttons: ['OK']
    });
    alert.present();
  }
}

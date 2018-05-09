import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { WebServicesProvider } from '../../providers/web-services/web-services';
import { ProductHomePage } from '../product-home/product-home';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: any;
  loginData = { login:'', password:'' };
  data: any;

  private serverHost = '';
  private printerHost = '';

  constructor(
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController, 
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public storage: Storage) {  
  }

  ionViewDidLoad() {
    //this.serverHost = localStorage.getItem("serverHost");
    //this.printerHost = localStorage.getItem("printerHost");
    this.storage.get('serverHost').then((val)=>{this.serverHost = val;});
    this.storage.get('printerHost').then((val)=>{this.printerHost =  val;});
  }

  doLogin() {
    if(!this.serverHost  || !this.printerHost ){
      this.showAlert();
    }
    else{
      this.showLoader();
      this.webService.login(this.loginData).then((result) => {
        this.loading.dismiss();
        this.data = result;
        if(result ===1){
          localStorage.setItem('token', this.data);
          localStorage.setItem('user',this.loginData.login);
          this.getLoggedinUserDetails(this.loginData.login);
          this.navCtrl.setRoot(ProductHomePage);
        }
        else{
          this.showWarning();
        }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast(err);
      });
    } 
  }

  getLoggedinUserDetails(user){
    this.webService.getLoggedinUserDetails(user).then((result) => {
      localStorage.setItem('store',result[0].storename);
      console.log(result[0].storename);
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
  
  showWarning() {
    let alert = this.alertCtrl.create({
      //title: 'Login Error!',
      subTitle: 'Wrong Login or Password.',
      buttons: ['OK']
    });
    alert.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Please configure Host address first.',
      buttons: ['OK']
    });
    alert.present();
  }
}

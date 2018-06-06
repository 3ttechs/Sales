import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private serverHost = '';
  private printerHost = '';
  private printerName = '';
  

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    //this.serverHost = localStorage.getItem("serverHost");
    //this.printerHost = localStorage.getItem("printerHost");
    this.storage.get('serverHost').then((val)=>{this.serverHost = val;});
    this.storage.get('printerHost').then((val)=>{this.printerHost =  val;});
    this.storage.get('printerName').then((val)=>{this.printerName =  val;});
  }

  SaveSettings(){
    this.storage.set('serverHost', this.serverHost);
    this.storage.set('printerHost', this.printerHost);
    this.storage.set('printerName', this.printerName);
    //localStorage.setItem('serverHost', this.serverHost);
    //localStorage.setItem('printerHost', this.printerHost);
    this.showAlert();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Settings saved.',
      buttons: ['OK']
    });
    alert.present();
  }

}

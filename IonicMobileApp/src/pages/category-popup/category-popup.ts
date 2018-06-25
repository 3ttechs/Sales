import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-category-popup',
  templateUrl: 'category-popup.html',
})
export class CategoryPopupPage {

  private productCode : string = '';
  private popupObj = {priceType:1,price:"0",billQty:"1",soldQty:"1"};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController) {
  }

  ionViewWillLoad() {
    const data = this.navParams.get('data');
    this.productCode = data.productCode;
    this.popupObj.price = data.price;
  }

  closePopup(){
    this.viewCtrl.dismiss();
  }

  AddToCart() {
    this.viewCtrl.dismiss(this.popupObj);
  }

}

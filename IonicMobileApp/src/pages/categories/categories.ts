import { Component } from '@angular/core';
import { NavController, App, LoadingController } from 'ionic-angular';
import { WebServicesProvider } from '../../providers/web-services/web-services';
import { ShoppingCartProvider } from '../../providers/shopping-cart/shopping-cart';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  loading: any;
  public products: any;
  private filterValues = {category:'All',brand:'All',productType:'All',pcode:'',barcode:'',pname:''};
  private selectedItem: any;
  private storeName = '';
  private categoryList: any;
  private brandList: any;
  private productTypeList: any;

  constructor(public app: App, 
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController,
    private shoppingCart: ShoppingCartProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.storeName = localStorage.getItem("store");
    if(localStorage.getItem("token")) {
      this.fetchCategories();
    }
  }

  fetchCategories(){
    this.loading = this.loadingCtrl.create({
      //content: 'Fetching Categories...'
    });

    this.loading.present().then(()=>{
      this.webService.getAllCategories().then(result => {
        this.categoryList = result;
        this.loading.dismiss();
        this.fetchBrands();
      });
    });
  }

  fetchBrands(){
    this.loading = this.loadingCtrl.create({
      //content: 'Fetching Brands...'
    });

    this.loading.present().then(()=>{
      //console.log('Categories being fetched');
      this.webService.getAllBrands().then(result => {
        this.brandList = result;
        this.loading.dismiss();
        this.fetchProductTypes();
      });
    });
  }

  fetchProductTypes(){
    this.loading = this.loadingCtrl.create({
      //content: 'Fetching Product Types...'
    });

    this.loading.present().then(()=>{
      this.webService.getAllProductTypes().then(result => {
        this.productTypeList = result;
        this.loading.dismiss();
        this.doFetchAllProducts();
      });
    });
  }

  search() {
    this.doFetchAllProducts();
  }

  doFetchAllProducts() {
    this.loading = this.loadingCtrl.create({
      //content: 'Fetching Products...'
    });

    this.loading.present().then(()=>{
      this.webService.getAllProducts(this.storeName,this.filterValues.category,this.filterValues.brand,this.filterValues.productType,this.filterValues.pcode,this.filterValues.barcode,this.filterValues.pname).then(result => {
        this.products = result;
        //console.log(result);
        this.loading.dismiss();
      });
    });
  }



  //if non selected, disable the add to cart button
  noneSelected(item){
    if(this.selectedItem != null){
      if(this.selectedItem.code == item.code)
        return false;
      else
        return true;
    }
    else
      return true;
  }

  itemSelected($event, item){
    this.selectedItem = item;
  }

  AddToCartPopUp() {
    let alert = this.alertCtrl.create({
      title: 'Code: ' + this.selectedItem.code,
      subTitle: 'Please enter Quantity and Price.',
      inputs: [
        {
          name: 'qty',
          placeholder: 'Quantity',
          type: 'number',
          value: '1'
        },
        {
          name: 'price',
          placeholder: 'Unit Price',
          type: 'number',
          value: "0"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.selectedItem.discount = 0;
            this.selectedItem.qty = data.qty <=0?1:data.qty; 
            this.selectedItem.price = data.price <0?0:data.price; 
            this.addItemToCart();
          }
        }
      ]
    });
    alert.present();
  }

  addItemToCart(){
    this.selectedItem.Vat = String((Number(this.selectedItem.price) * Number(this.selectedItem.qty)) * 0.05);
    this.selectedItem.amount = String(Number(this.selectedItem.price) * Number(this.selectedItem.qty));

    this.loading = this.loadingCtrl.create({
      //content: 'Adding item...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.addItemToCart(this.selectedItem);
	  this.selectedItem = null;
      this.loading.dismiss();
    });
  }
}

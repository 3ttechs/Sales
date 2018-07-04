import { Component } from '@angular/core';
import { Modal, NavController, App, LoadingController, ModalController } from 'ionic-angular';
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
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {
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

  AddToCartPage()
  {
    const myData = {
      productCode: this.selectedItem.code,
      price: this.selectedItem.price
    };
    const categoriesPopup: Modal = this.modalCtrl.create('CategoryPopupPage',{data:myData});
    categoriesPopup.present();

    categoriesPopup.onDidDismiss((data)=>{
      if(data != null){
        this.selectedItem.discount = 0;
        this.selectedItem.qty = data.billQty <=0?1:data.billQty; 
        this.selectedItem.soldQty = data.soldQty<=0?1:data.soldQty;

        if(data.priceType ==1){ //unit price, no change
          this.selectedItem.price = data.price <0?0:data.price; 
        }
        else if (data.priceType ==2){ //Dozen rate : price = price/12
          this.selectedItem.price = data.price <0?0:Number(data.price/12).toFixed(2); 
        }
        else { //Total amount : price = price/qty
          this.selectedItem.price = data.price <0?0:Number(data.price/this.selectedItem.qty).toFixed(2);  
        }

        this.addItemToCart();
      }
    });
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

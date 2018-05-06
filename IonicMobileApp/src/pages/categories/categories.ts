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
  public filteredProducts: any;
  private filterValues = {category:'',brand:'',pcode:'',barcode:'',pname:''};
  private selectedItem: any;

  constructor(public app: App, 
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController,
    private shoppingCart: ShoppingCartProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    if(localStorage.getItem("token")) {
      this.doFetchAllProducts();
    }
  }

  doFetchAllProducts() {
    this.loading = this.loadingCtrl.create({
      content: 'Fetching Products...'
    });

    this.loading.present().then(()=>{
      this.webService.getAllProducts().then(result => {
        this.products = result;
        this.filteredProducts = result;
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

  filterByCategory(event){
    // set val to the value of the searchbar
    let val = event.target.value==null?'':event.target.value;
    //Updating new value to the filterValues
    this.filterValues.category = val;
    //Call common method to filter the list
    this.filterItems();
  }

  filterByBrand(event){
    // set val to the value of the searchbar
    let val = event.target.value==null?'':event.target.value;
    //Updating new value to the filterValues
    this.filterValues.brand = val;
    //Call common method to filter the list
    this.filterItems();
  }

  filterByProductCode(event){
    // set val to the value of the searchbar
    let val = event.target.value==null?'':event.target.value;
    //Updating new value to the filterValues
    this.filterValues.pcode = val;
    //Call common method to filter the list
    this.filterItems();
  }

  filterByProductBarcode(event){
    // set val to the value of the searchbar
    let val = event.target.value==null?'':event.target.value;
    //Updating new value to the filterValues
    this.filterValues.barcode = val;
    //Call common method to filter the list
    this.filterItems();
  }

  filterByProductDescription(event){
    // set val to the value of the searchbar
    let val = event.target.value==null?'':event.target.value;
    //Updating new value to the filterValues
    this.filterValues.pname = val;
    //Call common method to filter the list
    this.filterItems();
  }

  filterItems(){
    this.filteredProducts = this.products.filter((item) => {
      return (
        item.category.toLowerCase().indexOf(this.filterValues.category.toLowerCase()) > -1 &&
        item.brand.toLowerCase().indexOf(this.filterValues.brand.toLowerCase()) > -1 &&
        item.code.toLowerCase().indexOf(this.filterValues.pcode.toLowerCase()) > -1 &&
        item.code.toLowerCase().indexOf(this.filterValues.barcode.toLowerCase()) > -1 &&
        item.name.toLowerCase().indexOf(this.filterValues.pname.toLowerCase()) > -1
      );
    })
  }

  AddToCartPopUp() {
    let alert = this.alertCtrl.create({
      title: 'Code: ' + this.selectedItem.code,
      subTitle: 'Please enter Quantity.',
      inputs: [
        {
          name: 'qty',
          placeholder: 'Quantity',
          type: 'number',
          value: '1'
        }
        /*,
        {
          name: 'discount',
          placeholder: 'Discount',
          type: 'number',
          value: "0"
        }*/
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
            //this.selectedItem.discount = data.discount <=0?0:data.discount;
            this.selectedItem.discount = 0;
            this.selectedItem.qty = data.qty <=0?1:data.qty; 
            this.addItemToCart();
          }
        }
      ]
    });
    alert.present();
  }

  addItemToCart(){
    this.selectedItem.Vat = String((Number(this.selectedItem.price) * Number(this.selectedItem.qty)) * 0.05);
    this.selectedItem.amount = String((Number(this.selectedItem.price) * Number(this.selectedItem.qty)) + Number(this.selectedItem.Vat) - Number(this.selectedItem.discount));

    this.loading = this.loadingCtrl.create({
      content: 'Adding item...'
    });

    this.loading.present().then(()=>{
      this.shoppingCart.addItemToCart(this.selectedItem);
	  this.selectedItem = null;
      this.loading.dismiss();
    });
  }
}

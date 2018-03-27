import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { WebServicesProvider } from '../../providers/web-services/web-services';
import { AddProductPage } from '../add-product/add-product';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  loading: any;
  public selectedCategory: any; //This value gets passed from previous Category Screen.
  public selectedProduct: {category:'', productCode:'', productName:''}; //Used to save user selection.
  private selectedProductName: string="Daisy"; //Used for mapping to UI when default value of selectedProduct is null. //TODO: Replace with default screen
  public products: any; //Final list of products by selected category. This is used for local storage.
  public filteredProducts: any; //Filtered list based on user input. Filtered from products. UI is bound to this list.

  constructor(public app: App, 
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController, 
    public navParams: NavParams) {
      this.selectedCategory = this.navParams.data.category_name;
  }

  ionViewDidLoad() {
    this.doFetchAllProductsByCategory();
  }

  doFetchAllProductsByCategory() {
    this.loading = this.loadingCtrl.create({
      content: 'Fetching Products...'
    });

    this.loading.present().then(()=>{
      this.webService.getAllProductsByCategory(this.selectedCategory).then(result => {
        this.products = result;
        this.filteredProducts = result;
        this.loading.dismiss();
      });
    });
  }

  productSelected($event,product){
    this.selectedProduct = {category:this.selectedCategory,productCode:product.code,productName:product.name};
    this.selectedProductName = product.name;
  }

  navigateToProductDetail(){
    this.navCtrl.push(AddProductPage,this.selectedProduct);
  }

  backToCategory(){
    this.navCtrl.pop();
  }

  filterItems(event){
    // Reset items back to all of the items
    this.filteredProducts = this.products;

    // set val to the value of the searchbar
    let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredProducts = this.products.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}

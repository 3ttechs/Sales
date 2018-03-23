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
  public selectedCategory: any;
  public selectedProduct: {category:'', productCode:'', productName:''};
  private selectedProductName: string="Daisy";
  public products: any;

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
}

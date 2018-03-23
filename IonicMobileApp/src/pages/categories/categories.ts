import { Component } from '@angular/core';
import { NavController, App, LoadingController } from 'ionic-angular';
import { WebServicesProvider } from '../../providers/web-services/web-services';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  loading: any;
  public categories: any;
  private selectedCategory: any;
  private selectedCategoryName: string="floral";

  constructor(public app: App, 
    public navCtrl: NavController, 
    public webService: WebServicesProvider, 
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    if(localStorage.getItem("token")) {
      this.doFetchAllCategories();
    }
  }

  doFetchAllCategories() {
    this.loading = this.loadingCtrl.create({
      content: 'Fetching Categories...'
    });

    this.loading.present().then(()=>{
      this.webService.getAllCategories().then(result => {
        this.categories = result;
        this.loading.dismiss();
      });
    });
  }

  categorySelected($event,category){
    this.selectedCategory = category;
    this.selectedCategoryName = category.category_name;
  }
  
  navigateToProducts(){
    this.navCtrl.push(ProductsPage,this.selectedCategory);
    
  }
}

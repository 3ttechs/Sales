import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductHomePage } from './product-home';

@NgModule({
  declarations: [
    ProductHomePage,
  ],
  imports: [
    IonicPageModule.forChild(ProductHomePage),
  ],
})
export class ProductHomePageModule {}

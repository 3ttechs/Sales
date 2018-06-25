import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryPopupPage } from './category-popup';

@NgModule({
  declarations: [
    CategoryPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryPopupPage),
  ],
})
export class CategoryPopupPageModule {}

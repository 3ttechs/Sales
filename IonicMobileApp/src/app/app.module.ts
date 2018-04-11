import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { SummaryPage } from '../pages/summary/summary';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProductHomePage } from '../pages/product-home/product-home';
import { WebServicesProvider } from '../providers/web-services/web-services';
import { CategoriesPage } from '../pages/categories/categories';
import { ProductsPage } from '../pages/products/products';
import { ShoppingCartProvider } from '../providers/shopping-cart/shopping-cart';
import { CartPage } from '../pages/cart/cart';
import { AboutPage } from '../pages/about/about';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProductHomePage,
    CategoriesPage,
    ProductsPage,
    SummaryPage,
    CartPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    //IonicModule.forRoot(MyApp,{tabsPlacement: 'top'}),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ProductHomePage,
    CategoriesPage,
    ProductsPage,
    SummaryPage,
    CartPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WebServicesProvider,
    ShoppingCartProvider
  ]
})
export class AppModule {}

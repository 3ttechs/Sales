import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { LoginPage } from '../pages/login/login';
import { AddProductPage } from '../pages/add-product/add-product';
import { SummaryPage } from '../pages/summary/summary';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProductHomePage } from '../pages/product-home/product-home';
import { WebServicesProvider } from '../providers/web-services/web-services';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProductHomePage,
    AddProductPage,
    SummaryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'}),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ProductHomePage,
    AddProductPage,
    SummaryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WebServicesProvider
  ]
})
export class AppModule {}

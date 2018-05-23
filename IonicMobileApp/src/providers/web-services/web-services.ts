import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

let serverUrl = 'http://';
let printUrl = 'http://';

@Injectable()
export class WebServicesProvider {

  constructor(public storage: Storage, public http: Http) {
    this.storage.get('serverHost').then((val)=>{serverUrl += val;});
    this.storage.get('printerHost').then((val)=>{printUrl +=  val;});
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        let postParams = {"login": credentials.login,"password": credentials.password}

        this.http.post(serverUrl +'/sales_person/login', postParams, {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  getLoggedinUserDetails(user){
    return new Promise(resolve => {
      this.http.get(serverUrl + '/store/details/login=' + '"'  + user + '"').subscribe(res => resolve(res.json())) 
    })
  }

  getAllProducts(storename,category,brand,ptype,pcode,barcode,pname) {
    return new Promise(resolve => {
      this.http.get(serverUrl + '/product/full_all_filtered/storename=' + '"'  + storename + '",category=' + '"'  + category + '",brand=' + '"'  + brand + '",product_type=' + '"'  + ptype + '",barcode=' + '"'  + barcode + '",description=' + '"'  + pname + '",code=' + '"'  + pcode + '"').subscribe(res => resolve(res.json()))
    })
  }

  getAllCategories(){
    return new Promise(resolve => {
      this.http.get(serverUrl + '/product_category/all').subscribe(res => resolve(res.json()))
    })
  }

  getAllBrands(){
    return new Promise(resolve => {
      this.http.get(serverUrl + '/product_brand/all').subscribe(res => resolve(res.json()))
    })
  }

  getAllProductTypes(){
    return new Promise(resolve => {
      this.http.get(serverUrl + '/product_type/all').subscribe(res => resolve(res.json()))
    })
  }

  getAllProductsByCategory(category) {
    return new Promise(resolve => {
      this.http.get(serverUrl + '/product/category=' + '"'  + category + '"').subscribe(res => resolve(res.json())) 
    })
  }

  getProductDetailsByCode(productCode){
    return new Promise(resolve => {
      this.http.get(serverUrl + '/product/code=' + '"'  + productCode + '"').subscribe(res => resolve(res.json()))
    })
  }

  logout(){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('X-Auth-Token', localStorage.getItem('token'));
        localStorage.clear();  //TODO : need to replace this with actual logout web sevice call
        resolve("true");
    });
  }

  placeOrder(summaryItem){
    return new Promise((resolve,reject) => {
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');

      this.http.post(serverUrl+'/invoice/add', JSON.stringify(summaryItem), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          console.log(err);
          reject(err);
        });
    })
  }

  printOrder(invoiceNumber){
    return new Promise((resolve,reject) =>{
      this.http.get(printUrl + '/invoice_print/invoice_no=' + invoiceNumber)
        .subscribe(res=>{
          resolve(res.json());
        },(err) => {
          console.log(err);
          reject(err);
        });
    })
  }
}

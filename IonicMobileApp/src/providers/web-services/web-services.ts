//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


let apiUrl = 'http://localhost:5000';

@Injectable()
export class WebServicesProvider {

  constructor(public http: Http) {
    console.log('Hello WebServicesProvider Provider');
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        //let postParams = {"login": "Abdul","password":"abdul"}
        let postParams = {"login": credentials.login,"password": credentials.password}

        this.http.post(apiUrl+'/sales_person/login', postParams, {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  getAllProducts() {
    return new Promise(resolve => {
      this.http.get(apiUrl + '/product/full_all').subscribe(res => resolve(res.json()))
    })
  }

  getAllProductsByCategory(category) {
    return new Promise(resolve => {
      this.http.get(apiUrl + '/product/category=' + '"'  + category + '"').subscribe(res => resolve(res.json())) 
    })
  }

  getProductDetailsByCode(productCode){
    return new Promise(resolve => {
      this.http.get(apiUrl + '/product/code=' + '"'  + productCode + '"').subscribe(res => resolve(res.json()))
    })
  }

  logout(){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('X-Auth-Token', localStorage.getItem('token'));

        /*this.http.post(apiUrl+'logout', {}, {headers: headers})
          .subscribe(res => {
            localStorage.clear();
          }, (err) => {
            reject(err);
          });*/

          localStorage.clear();  //TODO : need to replace this with actual logout web sevice call
          resolve("true");
    });
  }
}

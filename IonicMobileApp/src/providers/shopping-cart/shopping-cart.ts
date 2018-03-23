import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ShoppingCartProvider {

  public selectedItem = {productCode:'',productName:'',category:'',price:'',qty:''};
  public cartItems = {"items":[]};

  constructor(private storagemodule: Storage) {
    console.log('Hello ShoppingCartProvider Provider');
  }

  /*addItemToCart(selectedItem){
    console.log(selectedItem);
    this.storagemodule.set(selectedItem.productCode,JSON.stringify(selectedItem));
  }*/

  addItemToCart(selectedItem){
    new Promise((resolve)=>{
      this.storagemodule.get("cartItems").then(res=>{
        console.log(res);
        if(res != null) this.cartItems = res;
        this.cartItems.items.push(selectedItem);
        this.storagemodule.set("cartItems",this.cartItems);
      })
    })
  }

  getItemsFromCart(){
    return new Promise((resolve,reject) => {
      this.storagemodule.get("cartItems").then(res => resolve(res)).catch(err=>reject(console.log(err)))})
  }

  removeItemFromCart(filteredShoppingList){
    return new Promise((resolve,reject) => {
      this.cartItems.items = filteredShoppingList;
      this.storagemodule.set("cartItems",this.cartItems);
    })
  }

  placeOrder(){
    return new Promise((resolve,reject) => {
    this.cartItems = {"items":[]};
    this.storagemodule.set("cartItems",this.cartItems);
    resolve("true");
    })
  }
}

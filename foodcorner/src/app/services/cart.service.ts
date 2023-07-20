import { Injectable } from '@angular/core';
import { Cart } from '../shared/model/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../shared/model/CartItem';
import { Food } from '../shared/model/Food';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart:Cart= new Cart();
  private cartSubject:BehaviorSubject<Cart>=new BehaviorSubject(this.cart);
  constructor() { }
  //add to cart method
  addToCart(food:Food):void{
    let cartItem=this.cart.items.find(item => item.food.id===food.id);
    if(cartItem)
    return;


    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  //Remove Cart item
  removeFromCart(foodId:string):void{
    this.cart.items=this.cart.items.filter(item=>item.food.id!==foodId);
    this.setCartToLocalStorage();
  }

  //change quantity
  changeQuantity(foodId:string,qty:number){
    let cartItem=this.cart.items.find(item=>item.food.id ===foodId);
    if(!cartItem)
    return

    cartItem.quantity=qty;
    cartItem.price=qty*cartItem.food.price;
    this.setCartToLocalStorage();
  }

  //clear cart
  clearCart(){
    this.cart=new Cart();
    this.setCartToLocalStorage();
  }

  //get cart observable
  getCartObservable():Observable<Cart>{
    return this.cartSubject.asObservable();
  }
  //now set local storage

  private setCartToLocalStorage():void{
    this.cart.totalPrice=this.cart.items.reduce((prevSum,currItem)=>
    prevSum + currItem.price,0);
    this.cart.totalCount=this.cart.items.reduce((prevSum,currItem)=>
    prevSum + currItem.quantity,0);

    const cartJson=JSON.stringify(this.cart);
    localStorage.setItem('Cart',cartJson);
    this.cartSubject.next(this.cart);
  }

  //get data from local storage

  private getCartFromLocalStorage():Cart{
    const cartJson=localStorage.getItem('Cart');
    return cartJson?JSON.parse(cartJson):new Cart();
  }
}

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Product } from '../_interface/manager/product.interface';
import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs/operators';
import { ToastType } from '../_interface/manager/manager.interface';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  uid: string;

  constructor(private firestore: AngularFirestore,
    private managerService: ManagerService,
    private authenticationService: AuthenticationService) {
      this.uid = this.authenticationService.getCurrentUser()?.uid;
  }




  getProducts(): Observable<any> {
    const db = this.firestore.collection
    ('products', ref => ref.orderBy('createTimestamp')).snapshotChanges().pipe(map(
      (action) => {
        return action.map((a) => {
          const data = a.payload.doc.data() as object;
          const id = a.payload.doc.id;
          const res = {id: id, ...data};
          return res;
        });
      }
    ));

    return db;
  }


  addProduct(product: Product) {
    product.createTimestamp = firebase.firestore.FieldValue.serverTimestamp();
    product.lastEditTimestamp = firebase.firestore.FieldValue.serverTimestamp();
    this.firestore.collection('products').add({...product}).then(() => {
      console.log('add product ' + product.name + '!!');
      this.managerService.setToast({detail: '成功新增商品', summary: ToastType.success});
    }).catch(err => {
      this.managerService.setToast({detail: err, summary: ToastType.error});
    });
  }


  setProduct(product: Product) {
    product.lastEditTimestamp = firebase.firestore.FieldValue.serverTimestamp();
    console.log('setProfileCard: ' + JSON.stringify(product));
    const productId = product.id;
    delete product.id;
    this.firestore.collection('products').doc(productId)
    .set({...product}).then(() => {
      console.log('set product ' + product.name + '!!');
      this.managerService.setToast({detail: '成功修改商品', summary: ToastType.success});
    }).catch(err => {
      this.managerService.setToast({detail: err, summary: ToastType.error});
    });;
  }


  deleteProduct(productId: string) {
    this.firestore.collection('products').doc(productId).delete().then(() => {
      console.log('delete profile card');
    }).catch(err => {
      this.managerService.setToast({detail: err, summary: ToastType.error});
    });;
  }

}

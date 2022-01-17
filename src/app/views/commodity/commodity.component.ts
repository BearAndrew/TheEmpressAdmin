import { FirebaseService } from './../../_service/firebase.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject } from 'rxjs';
import { ToastType } from 'src/app/_interface/manager/manager.interface';
import { Product } from 'src/app/_interface/manager/product.interface';
import { ManagerService } from 'src/app/_service/manager.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class CommodityComponent implements OnInit {

  @ViewChild('productImgFU') productImgFU: FileUpload;
  productDialog: boolean;
  products: Product[] = [];
  product: Product = new Product();
  selectedProducts: Product[];
  submitted: boolean;
  statuses: any[];

  constructor(
    private managerService: ManagerService,
    private firebaseService: FirebaseService,
    private confirmationService: ConfirmationService) {
      this.managerService.spinnerStatus(true, 'table');
      this.firebaseService.getProducts().subscribe(
        data => {
          this.managerService.spinnerStatus(false, 'table');
          this.products = data;
          console.log(JSON.stringify(this.products));
        });
    }

  ngOnInit() {
    this.statuses = [
      {label: 'INSTOCK', value: 'instock'},
      {label: 'LOWSTOCK', value: 'lowstock'},
      {label: 'OUTOFSTOCK', value: 'outofstock'}
    ];
  }


  openNew() {
      this.product = new Product();
      this.submitted = false;
      this.productDialog = true;
  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected products?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => !this.selectedProducts.includes(val));
              this.selectedProducts = null;
              this.managerService.setToast({detail: '成功刪除商品', summary: ToastType.success});
          }
      });
  }

  editProduct(product: Product) {
      this.product = {...product};
      this.productDialog = true;
  }

  deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete ' + product.name + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => val.id !== product.id);
              this.product = new Product();
              this.managerService.setToast({detail: '成功刪除商品', summary: ToastType.success});
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }

  saveProduct() {
      this.submitted = true;

      if (this.product.name.trim()) {
          if (this.product.id) {
              // this.products[this.findIndexById(this.product.id)] = this.product;
              this.firebaseService.setProduct(this.product);
          }
          else {
              // this.product.id = this.createId();
              // this.products.push(this.product);
              this.firebaseService.addProduct(this.product);
          }

          // this.products = [...this.products];
          this.productDialog = false;
          this.product = new Product();
          console.log(JSON.stringify(this.products));
      }
  }

  // findIndexById(id: string): number {
  //     let index = -1;
  //     for (let i = 0; i < this.products.length; i++) {
  //         if (this.products[i].id === id) {
  //             index = i;
  //             break;
  //         }
  //     }
  //     return index;
  // }

  // createId(): string {
  //     let id: string = '';
  //     var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //     for ( var i = 0; i < 20; i++ ) {
  //         id += chars.charAt(Math.floor(Math.random() * chars.length));
  //     }
  //     return id;
  // }


  // table 換頁回到頂部
  pageChange() {
    window.scroll(0, 0);
  }


  // 選擇上傳照片
  chooseImgFU() {
    this.productImgFU.choose();
  }

  // 移除目前照片List
  removeImg(showPhoto) {
    const index = this.product.imageList.indexOf(showPhoto);
    if (index > -1) {
      this.product.imageList.splice(index, 1);
    }
  }

  // 上傳照片完成後, 放到照片List中
  async productImgFUChange(event) {
    let i = 0;
    let uploadPhotoList = [];
    uploadPhotoList = await this.getPhotoList(uploadPhotoList);
    this.product.imageList = [...this.product.imageList, ...uploadPhotoList];
  }

  // 等待全部照片 onload 完成才輸出 showPhotoList
  private getPhotoList(uploadPhotoList): Promise<string[]> {
    return new Promise((resolve) => {
      // subject 觀察是否完成全部照片上傳
      const subject = new BehaviorSubject<number>(0);
      subject.subscribe(
        data => {
          if (data == this.productImgFU.files.length) {
            this.productImgFU.files = [];
            resolve(uploadPhotoList);
            subject.complete;
          }
      });

      for (let i = 0; i < this.productImgFU.files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          const base64Photo = btoa(binaryString);
          uploadPhotoList.push(base64Photo);
          subject.next(i + 1);
          // this.uploadImage(this.productImgFU.files[i].name, this.productImgFU.files[i]).then(
          //   res => {
          //     subject.next(i + 1);
          //     console.log(res);
          //   }
          // )
        };
        reader.readAsBinaryString(this.productImgFU.files[i]);
      }
    });
  }


  uploadImage(name: string, data) {
    let promise = new Promise((res,rej) => {
        let fileName = name;
        let uploadTask = firebase.storage().ref(`/image/products/${fileName}`).put(data);
        uploadTask.on('state_changed',
          snapshot => {
        },
          error => {
            rej(error);
        },
          () => {
            var downloadURL = uploadTask.snapshot.downloadURL;
            res(downloadURL);
        });
    });
    return promise;
 }

}

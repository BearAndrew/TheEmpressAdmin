import { ToastType } from './../_interface/manager/manager.interface';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api/';
import { ReplaySubject, Observable } from 'rxjs';
import { IToast } from '../_interface/manager/manager.interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  sidebarSwitch: string = '';
  private toastSubject: ReplaySubject<IToast> = new ReplaySubject<IToast>();
  private spinnerSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>();


  constructor(private messageService: MessageService, private spinner: NgxSpinnerService) { }

  toggleSidebar() {
    this.sidebarSwitch = this.sidebarSwitch == '' ? 'show' : '';
  }

  //#region Toast
  // Toast 提示
  toast(detail: string, summary: string, severity: string = 'info', life: number = 5000, sticky: boolean = false) {
    if (summary == ToastType.clear) {
      // 清除所有 Toast 提示
      this.messageService.clear();
    } else {
      this.messageService.add({ key: 'toast', detail: detail, summary: summary, severity: severity, life: life, sticky: sticky });
    }
  }

  // 設定 Toast 提示
  setToast(toast: IToast) {
    this.toastSubject.next(toast);
  }

  // 取得 Toast 提示
  getToast(): Observable<IToast> {
    return this.toastSubject.asObservable();
  }
  //#endregion



  //#region spinner
  spinnerStatus(isShow: boolean, name?: string) {
    if (isShow) {
      this.spinner.show(name);
    } else {
      this.spinner.hide(name);
    }
  }

  setFullScreenSpinner(isShow: boolean) {
    this.spinnerSubject.next(isShow);
  }

  getFullScreenSpinner(): Observable<boolean> {
    return this.spinnerSubject.asObservable();
  }
  //#endregion

}

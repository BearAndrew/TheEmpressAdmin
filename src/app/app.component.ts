import { ToastType } from './_interface/manager/manager.interface';
import { Component } from '@angular/core';
import { ManagerService } from './_service/manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private managerService: ManagerService) {
    this.getToast();
    this.getFullScreenSpinner();
  }

  getToast() {
    this.managerService.getToast().subscribe(
      data =>{
        this.managerService.toast(data.detail, data.summary);
      },
      err => {
        this.managerService.toast(err, ToastType.error);
      }
    );
  }

  getFullScreenSpinner() {
    this.managerService.getFullScreenSpinner().subscribe(
      data => {
        this.managerService.spinnerStatus(data, 'fullscreen');
      },
      err => {
        this.managerService.toast(err, ToastType.error);
      }
    );
  }

}

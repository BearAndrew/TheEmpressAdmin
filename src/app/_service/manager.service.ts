import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  sidebarSwitch: string = '';

  constructor() { }

  toggleSidebar() {
    this.sidebarSwitch = this.sidebarSwitch == '' ? 'show' : '';
  }

}

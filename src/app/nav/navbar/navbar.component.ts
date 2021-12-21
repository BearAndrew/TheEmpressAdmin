import { AuthenticationService } from './../../_service/authentication.service';
import { ManagerService } from './../../_service/manager.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('profileDropdown', { static: true }) profileDropdown: any;

  constructor(public managerService: ManagerService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  logout() {
    this.profileDropdown.hide();
    this.authenticationService.logout();
  }
}

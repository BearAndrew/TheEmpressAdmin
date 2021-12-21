import { CloudMessageService } from './../../_service/cloud-message.service';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // if (document.body.scrollTop > 20 ||
    // document.documentElement.scrollTop > 20) {
    //   document.getElementById('navbar').classList.add('bg-dark');
    //   document.getElementById('navbar').classList.add('top-0');
    // }

    // if (document.documentElement.scrollTop == 0) {
    //   document.getElementById('navbar').classList.remove('bg-dark');
    //   document.getElementById('navbar').classList.remove('top-0');
    // }
  }

  constructor(private cloudMessageService: CloudMessageService) {
    this.cloudMessageService.getPermission();
  }

  ngOnInit(): void {
  }

}

import { ManagerService } from './../../_service/manager.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_service/authentication.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})

export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;

  fg: FormGroup;
  error_messages = {
    account: [
      { type: 'required', message: 'Account is required.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length must be more than 6.' },
    ]
  };

  isLoginCalled = false;
  disableLoginBtn = false;

  // different-credential-modal
  isDiffCredProvier: boolean; // 是否有不同驗證方式
  diffCredEmail: string; // 不同驗證方式的 Email
  diffCredPw: string; // 不同驗證方式的密碼

  private showLoginPageSub: Subscription;

  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private managerService: ManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) {

    this.managerService.setFullScreenSpinner(true);
    this.showLoginPageSub = authenticationService.showLoginPage().subscribe((data) => {
      this.isLoginCalled = data;
      this.managerService.setFullScreenSpinner(false);
    });
  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      account: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.showLoginPageSub.unsubscribe();
  }

  get account() { return this.fg.get('account'); }

  get password() { return this.fg.get('password'); }


  routeToRegister() {
    // this.router.navigate(['/register'], { queryParams: { returnUrl: this.state.url }});
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
    this.router.navigate(['/register'], { queryParams: { returnUrl: returnUrl }});
  }


  addToast(msg: string) {
    // this.messageService.clear();
    this.messageService.add({key: 'bc', severity: 'error', summary: '錯誤', detail: msg});
  }


  emailLogin() {
    this.authenticationService.emailLogin(this.account.value, this.password.value).then(
      (resolve) => {
        console.log(resolve);
      },
      (reject) => {
        console.log(reject);
        let msg = '帳號密碼錯誤';
        if (reject === 'Not vertify') {
          msg = '電子郵件尚未認證';
        }
        this.addToast(msg);
      }
    );
  }


  providerLogin(providerName: string) {
    this.authenticationService.providerLogin(providerName).then(
      (resolve) => {
        console.log('Provider login resolve : ' + resolve);
      },
      (reject) => {
        console.log('Provider login reject : ' + JSON.stringify(reject));
        this.isDiffCredProvier = (reject.method === 'password') ? false : true;
        this.diffCredEmail = reject.email;
        this.myModal.show();
      }
    );
  }


  linkCreditProvider() {
    this.authenticationService.linkCreditProvider();
  }


  linkCreditEmail() {
    this.authenticationService.linkCreditEmail(this.diffCredPw);
  }

}

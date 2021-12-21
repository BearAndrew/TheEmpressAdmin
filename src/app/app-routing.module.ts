import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ContainerComponent } from './container/container/container.component';
import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { AuthGuard } from './auth/auth.guard';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: ContainerComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: AppComponent },
];

@NgModule({
  // scrollPositionRestoration : scroll to top
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

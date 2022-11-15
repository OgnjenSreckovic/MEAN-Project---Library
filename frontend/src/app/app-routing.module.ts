import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './shared/register/register.component';
import { BookFormComponent } from './shared/book-form/book-form.component';

const readerModule = () => import('./reader/reader.module').then(x => x.ReaderModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);


const routes: Routes = [
  {
    path: '',
    redirectTo: 'pocetna',
    pathMatch: 'full'
  },
  {
    path: "pocetna",
    component: HomeComponent
  },
  {
    path: "prijava",
    component: LoginComponent
  },
  {
    path: "registracija",
    component: RegisterComponent
  },
  {
    path: "citalac",
    loadChildren: readerModule
  },
  {
    path: "moderator",
    loadChildren: readerModule
  },
  {
    path: "moderator/nova-knjiga",
    component: BookFormComponent
  },
  {
    path: "admin",
    loadChildren: adminModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

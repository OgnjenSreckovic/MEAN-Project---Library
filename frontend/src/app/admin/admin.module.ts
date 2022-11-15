import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from '../shared/register/register.component';
import { SharedModule } from '../shared/shared.module';
import {MatTableModule} from '@angular/material/table';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MatIconModule } from '@angular/material/icon';
import { RentPeriodSetterComponent } from './rent-period-setter/rent-period-setter.component';
import { BooksComponent } from './books/books.component';



@NgModule({
  declarations: [
    UsersComponent,
    LoginComponent,
    LayoutComponent,
    EditUserComponent,
    RentPeriodSetterComponent,
    BooksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    SharedModule
  ]
})
export class AdminModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from "@angular/router";
import { BookDetailsComponent } from '../reader/book-details/book-details.component';
import { EditBookComponent } from '../shared/edit-book/edit-book.component';
import { BooksComponent } from './books/books.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from "./users/users.component";

const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      children: [
        {
          path: '',
          redirectTo: 'prijava',
          pathMatch: 'full'
        },
        {
            path: 'korisnici',
            component: UsersComponent
        },
        {
            path: "prijava",
            component: LoginComponent
        },
        { 
          // path: korisnik/:username
          matcher: (url : UrlSegment[]) => {
            if ((url.length === 2) && (url[0].path === "korisnik")){
              return { consumed: url }
            } else{
              return null;
            }
          },
          component: EditUserComponent
        },
        {
          path: "knjige",
          component: BooksComponent
        },
        { 
          // path: knjiga/:id
          matcher: (url : UrlSegment[]) => {
            if ((url.length === 2) && (url[0].path === "knjiga")){
              return { consumed: url }
            } else{
              return null;
            }
          },
          component: BookDetailsComponent
        }
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }
  
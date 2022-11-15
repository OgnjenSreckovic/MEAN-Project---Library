import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { BookFormComponent } from '../shared/book-form/book-form.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { ProfileComponent } from './profile/profile.component';
import { RentHistoryComponent } from './rent-history/rent-history.component';
import { RentedBooksComponent } from './rented-books/rented-books.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'pocetna',
        pathMatch: 'full'
      },
      {
        path: 'pocetna',
        component: HomeComponent
      },
      {
        path: 'profil',
        component: ProfileComponent
      },
      {
        path: 'pretraga',
        component: SearchComponent
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
      },
      {
        path: "zaduzene",
        component: RentedBooksComponent
      },
      {
        path: "istorija",
        component: RentHistoryComponent
      },
      {
        path: "nova-knjiga",
        component: BookFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitalacRoutingModule { }

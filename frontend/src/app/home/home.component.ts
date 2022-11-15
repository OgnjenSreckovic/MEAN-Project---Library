import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Knjiga } from '../models/Book';
import { User } from '../models/User';
import { BooksService } from '../services/books.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loggedIn : boolean;
  books : Knjiga[];

  constructor(
    private booksService : BooksService,
    private router : Router
  ) { }

  ngOnInit(): void {
    let admin = sessionStorage.getItem("admin");
    if (admin) {
      this.router.navigate(["admin"]);
    }
    let userString = sessionStorage.getItem('user');
    this.loggedIn = (userString != null);
    if (this.loggedIn) {
      let user = User.fromString(userString);
      this.router.navigate([user.type, "pocetna"]);
    }

    this.booksService.getTopBooks().subscribe(
      (books : Knjiga[]) => {
        this.books = books;
      }
    );

  }

}

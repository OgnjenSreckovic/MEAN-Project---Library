import { Component, OnInit } from '@angular/core';
import { Knjiga } from '../../models/Book';
import { BooksService } from '../../services/books.service';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  book = null;

  constructor(
    private menuComponent : MenuComponent,
    private bookService : BooksService
  ) { }

  ngOnInit(): void {
    this.menuComponent.refreshMenuItems();
    
    this.bookService.getBookOfTheDay().subscribe(
      (book : Knjiga) => {
        this.book = book;
      }
    )
  }

  viewBook() {
    alert("viewBook");
  }
  
}

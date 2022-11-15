import { Component, Input, OnInit } from '@angular/core';
import { RentedBook } from 'src/app/models/User';
import { BooksService } from 'src/app/services/books.service';
import { Knjiga } from '../../models/Book';

@Component({
  selector: 'app-book-preview',
  templateUrl: './book-preview.component.html',
  styleUrls: ['./book-preview.component.css']
})
export class BookPreviewComponent implements OnInit {

  @Input() book : Knjiga;
  authorsString: string;

  isRented : boolean = false;
  daysUntilDeadline : number;
  @Input() rentInfo : RentedBook = null;

  constructor(
    private bookService : BooksService
   ) { }

  ngOnInit(): void {
    
    if (this.rentInfo != null) {
      if (this.book == null){
        this.bookService.getBook(this.rentInfo.bookId).subscribe(
          (book : Knjiga) => {
            this.book = book;
            this.authorsString = this.book.authors.join(', ');
          }
        );
      }
      this.isRented = true;
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let deadline = new Date(
        this.rentInfo.dateRented.getFullYear(),
        this.rentInfo.dateRented.getMonth(),
        this.rentInfo.dateRented.getDate() + this.rentInfo.rentPeriod,
        0, 0, 0, 0
      );
      this.daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000*60*60*24));
    } else {
      this.authorsString = this.book.authors.join(', ');
    }
  }

}

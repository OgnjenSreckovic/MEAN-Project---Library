import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { Knjiga } from '../../models/Book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: Knjiga[];
  columnsToDisplay = ['image', 'title', 'authors', 'genres', 'publisher', 'year', 'copies', 'avgReview', 'delete', 'edit'];

  constructor(
    private bookService: BooksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(){
    this.bookService.getAllBooks().subscribe((books: Knjiga[])=>{
      this.books = [];
      books.forEach(
        b=>this.books.push(new Knjiga(b))
      );
    })
  }

  delete(book: Knjiga){ 
    this.bookService.delete(book._id).subscribe(
      (res) => {
        this.getBooks();
      }
    )
  }

  
  edit(book: Knjiga){
    this.router.navigate(["admin", "knjiga", book._id]);
  }


}

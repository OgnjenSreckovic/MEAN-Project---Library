import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Knjiga } from '../../models/Book';
import { User } from '../../models/User';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  user: User;
  form: FormGroup;
  submitted: boolean = false;
  allBooks : Knjiga[];
  books : Knjiga[];

  constructor(
    private formBuilder: FormBuilder,
    private bookService :  BooksService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.loadAllBooks();

    let userString = sessionStorage.getItem('user'); 
    if (userString == null){
      this.user = null;
    }else{
      this.user = JSON.parse(userString);  
    }    

    this.form = this.formBuilder.group(
      {
        title: [''],
        authors: ['']
      }
    );
    
  }

  loadAllBooks() {
    this.allBooks = [];
    // this.bookService.getAll().subscribe();

  }

  get f() { return this.form.controls; }

  search() {
    this.bookService.searchBooks(this.form.controls.title.value, this.form.controls.authors.value).subscribe(
      (books : Knjiga[]) => {
        this.books = books;
      }
    )
  }

  viewBookDetails(bookId: string){
    if (this.user) 
      this.router.navigate([`/${this.user.type}/knjiga/${bookId}`]);
    else
      alert("Morate biti prijavljeni da biste videli detalje knjige.");
  }
}

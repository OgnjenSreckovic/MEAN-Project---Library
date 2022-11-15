import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Knjiga } from '../../models/Book';
import { User } from 'src/app/models/User';
import { BooksService } from 'src/app/services/books.service';
import { Sort } from '@angular/material/sort';


export interface TableEntry {
  bookTitle : string;
  bookAuthors: string[];
  dateRented: Date;
  dateReturned: Date;
  bookUrl: string;
}



@Component({
  selector: 'app-rent-history',
  templateUrl: './rent-history.component.html',
  styleUrls: ['./rent-history.component.css']
})
export class RentHistoryComponent implements OnInit {
  user : User;
  columnsToDisplay: string[] = ['bookTitle', 'bookAuthors', 'dateRented', 'dateReturned', 'bookUrl'];
  data: TableEntry[];
  dataSource : TableEntry[];


  constructor(
    private router: Router,
    private bookService: BooksService
  ) { }

  ngOnInit(): void {
    let userString = sessionStorage.getItem('user'); 
    if (userString == null){
      this.router.navigate(['/']);
    }else{
      this.user = User.fromString(userString);
    }

    let bookIds: string[] = []; 
    let hashmap = new Map<string, TableEntry[]>();
    this.data = [];
    
    for (let e of this.user.rentHistory){
      if (!bookIds.includes(e.bookId)) bookIds.push(e.bookId);
      let arr = [];
      if (hashmap.has(e.bookId)){
        arr = hashmap.get(e.bookId);
      }
      arr.push({
        bookTitle : null,
        bookAuthors: null,
        dateRented: new Date(e.dateRented),
        dateReturned: new Date(e.dateReturned),
        bookUrl: `/citalac/knjiga/${e.bookId}`
      });

      hashmap.set(e.bookId, arr);
    }
    
    this.bookService.getBooks(bookIds).subscribe(
      (books : Knjiga[])=>{
        for (let book of books) {
          let oldArr: TableEntry[] = hashmap.get(book._id);
          hashmap.set(book._id, null);
          oldArr.forEach((e, i, oldArr)=>{
            e.bookTitle = book.title,
            e.bookAuthors = book.authors
            this.data.push(e);
          })
        }
        this.dataSource = this.data.slice();
        this.sortData({ active: 'dateReturned', direction: 'desc' });
      }
    );
  }

  private compare(a: string | Date, b: string | Date, isAsc: boolean){
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.dataSource = this.data.slice();
      return;
    }
    console.log(sort);
    console.log(this.dataSource);
    this.dataSource = this.data.slice().sort((a, b)=>{
      let isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'bookTitle':
          return this.compare(a.bookTitle, b.bookTitle, isAsc);
        case 'bookAuthors':
          return this.compare(a.bookAuthors[0], b.bookAuthors[0], isAsc);
        case 'dateRented':
          return this.compare(a.dateRented, b.dateRented, isAsc);
        case 'dateReturned':
          return this.compare(a.dateReturned, b.dateReturned, isAsc);
        default:
          return 0;
      }
    })
    console.log(this.dataSource);
  }

}

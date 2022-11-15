import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, Knjiga } from '../models/Book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
   
  readonly url = "http://localhost:4000/books/";

  constructor(
    private http : HttpClient
  ) { }

  getTopBooks() {
    return this.http.get(`${this.url}getTop3Books`);
  }

  getBookOfTheDay(){
    return this.http.get(`${this.url}getBookOfTheDay`);
  }

  searchBooks(titleFilter: string, authorFilter) {
    let params = new HttpParams()
      .set("titleFilter", titleFilter)
      .set("authorFilter", authorFilter);
    return this.http.get(`${this.url}search`, { params });
  }

  getBook(bookId : string) {
    let url = `${this.url}getBookById/${bookId}`;
    return this.http.get<Knjiga>(url);
  }

  getBooks(bookIds: string[]) {
    let data = {bookIds : bookIds};
    return this.http.post(`${this.url}getBooks`, data);
  }

  postComment(bookId: string, comment: Comment) {
    let data = {
      bookId : bookId,
      username : comment.username,
      review : comment.review,
      text : comment.text,
      date : comment.date
    };
    return this.http.post(`${this.url}postComment`, data);
  }

  addBook(data){
    const bookData = new FormData();
    bookData.append("title", data.title);
    bookData.append("authors", data.authors);
    bookData.append("genres", data.genres);
    bookData.append("language", data.language);
    bookData.append("publisher", data.publisher);
    bookData.append("year", data.year);
    bookData.append("avalCopies", data.availCopies);
    return this.http.post(`${this.url}addBook`, data);
  }

  setImage(bookId : string, oldImagePath: string, imgFile: File){
    const bookData = new FormData();
    bookData.append("bookId", bookId);
    bookData.append("oldImagePath", oldImagePath);
    if (imgFile){
      bookData.append("image", imgFile, bookId);
    }
    return this.http.post(`${this.url}setImage`, bookData);
  }

  editBook(
    bookId : string,
    title: string,
    authors: string[],
    genres: string[],
    language: string,
    publisher: string,
    year: number,
    availCopies: number
  ){
    let data = {
      bookId: bookId, 
      title: title,
      authors: authors,
      genres: genres,
      language: language,
      publisher: publisher,
      year: year,
      availCopies: availCopies
    };
    return this.http.post(`${this.url}editBook`, data);
  }

  getAllBooks(){
    return this.http.get(`${this.url}getAllBooks`);
  }

  delete(bookId){
    return this.http.post(`${this.url}delete`, {bookId : bookId});
  }
}

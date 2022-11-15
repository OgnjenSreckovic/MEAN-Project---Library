import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Comment, Knjiga } from '../../models/Book';
import { BooksService } from '../../services/books.service';
import { User } from '../../models/User';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  user : User;
  bookId : string = null;
  book : Knjiga = null;
  authorsString: string;
  genresString: string;
  userHasThisBook: boolean;
  rentError: string;
  canComment: boolean;
  userComment: Comment;

  // moderator area ///////////
  isMod : boolean = false;
  editMode : boolean = false;
  isAdmin: boolean;
  editFinished(book : Knjiga){
    this.editMode = false;
    if (book) {
      this.book = book;
      this.arraysToStringsInit();
    }
  }
  /////////////////////////////


  constructor(
    private userService : UserService,
    private bookService : BooksService,
    private router : Router,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    let segments : string[] = this.router.url.split("/");
    if (segments.length === 4) {
      if (segments[2] == "knjiga") {
        this.bookId = segments[3];
      }
    }
    this.isMod = this.isAdmin = (sessionStorage.getItem("admin") != null);
    if (!this.isAdmin) {
      let userString = sessionStorage.getItem('user'); 
      if (userString == null){
        this.router.navigate(['/']);
      }else{
        this.user = JSON.parse(userString);
        this.isMod = (this.user.type == "moderator");  
      }
    }

    this.bookService.getBook(this.bookId).subscribe(
      (book : Knjiga) => {
        this.book = new Knjiga(book);

        this.arraysToStringsInit();
        this.commentsInit();

        if (this.isAdmin) this.userHasThisBook = false;
        else if (
          this.user.rentedBooks.filter(
            (o)=>{ 
              return o["bookId"] == this.bookId 
            }
          ).length > 0
        ) this.userHasThisBook = true;
        else this.userHasThisBook = false;
      }
    )
  }

  private commentsInit(){
    this.book.comments.sort((c1, c2) => {
      return c1.date < c2.date ? 1 : -1;
    })

    if (this.user) {
      this.canComment = false;
      this.canComment ||= this.user.rentHistory.some(rb=>{ return rb.bookId==this.bookId; });
      this.canComment ||= this.user.rentedBooks.some(rb=>{ return rb.bookId==this.bookId; });
      this.userComment = this.book.comments.find(c => {
        return c.username == this.user.username;
      });
      if (this.userComment) 
        this.userComment.date = new Date(this.userComment.date);
    } else { 
      this.userComment = null;
    }
      
  }

  private arraysToStringsInit(){
    this.authorsString = this.book.authors.join(', ');
    this.genresString = this.book.genres.join(", ");
  }

  private hasOverdueBooks() {
    let has = false;
    if (!this.user) return has;

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let i = 0;
    while (i < this.user.rentedBooks.length && has==false){
        let deadline = new Date(this.user.rentedBooks[i].dateRented);
        deadline.setHours(0, 0, 0, 0)
        deadline.setDate(deadline.getDate() + this.user.rentedBooks[i].rentPeriod);
        has = (today > deadline);
        i++;
    }
    return has;
}

  
  
  rent(){
    if (!this.user) return;
    if (this.book.availCopies == 0) return;
    if (this.userHasThisBook) return;

    if (this.user.rentedBooks.length == 3) {
      this.rentError = "Ne možete zadužiti više od tri knjige.";
      return;
    }
    
    if (this.hasOverdueBooks()) {
      this.rentError = "Ne možete zadužiti knjigu ako imate knjige kojima je istekao rok za vraćanje.";
      return;
    }

    this.userService.rent(this.user.username, this.bookId).subscribe(
      (res : {user: User; book : Knjiga}) => {
        if (res.user==null || res.book == null) alert("Greska pri zaduzivanju knjige.");
        else { 
          this.zone.run(()=>{ 
            this.user = res.user;
            sessionStorage.setItem("user", JSON.stringify(this.user));
            this.book = new Knjiga(res.book);  
            this.userHasThisBook = true; 
            this.canComment = true;
          });          
          alert("Uspešno ste zadužili ovu knjigu");    
        }
      }
    );
  }

  onCommentPosted(comment: Comment) {
    if (!this.user) return;
     
    if (this.userComment != null) {
      comment.text = `[ Izmenjen ${comment.date.toLocaleDateString()} ]\n${comment.text}`;
    }
    
    this.bookService.postComment(this.bookId, comment).subscribe(
      (book : Knjiga) => {
        console.log(book);
        this.book = new Knjiga(book);
        this.commentsInit();
      }
    )
  }
}

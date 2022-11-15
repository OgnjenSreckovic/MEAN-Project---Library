import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { RentedBook, User } from '../../models/User';

@Component({
  selector: 'app-rented-books',
  templateUrl: './rented-books.component.html',
  styleUrls: ['./rented-books.component.css']
})
export class RentedBooksComponent implements OnInit {

  user : User;

  constructor(
    private router: Router,
    private userService : UserService
  ) { }

  ngOnInit(): void {
    let userString = sessionStorage.getItem('user'); 
    if (userString == null){
      this.router.navigate(['/']);
    }else{
      this.user = User.fromString(userString);
    }
  }

  returnBook(rentInfo : RentedBook) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    rentInfo.dateReturned = today;
    console.log(rentInfo);

    this.userService.returnBook(this.user.username, rentInfo).subscribe(
      (user) => {
        if (user) {
          console.log(user);
          this.user = User.fromJSON(user);
          sessionStorage.setItem("user", JSON.stringify(this.user));
          alert("Uspešno ste razdužili knjigu.");
        } else {
          alert("Razduživanje knjige nije uspelo.");
        }
      }
    )
  }


  bookDetails(bookId : string) {
    this.router.navigate([`/citalac/knjiga/${bookId}`]);
  }

}

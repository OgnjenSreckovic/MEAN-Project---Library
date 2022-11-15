import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { Comment } from '../../models/Book';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment : Comment;
  user : User = null;;

  constructor(
    private userService : UserService
  ) { }

  ngOnInit(): void {
    if (this.comment == null) {
      this.comment = new Comment();
      this.comment.username = "<empty>";
      this.comment.review = 0;
      this.comment.text = "<empty>";
      this.comment.date =  null;
    }

    this.userService.getUser(this.comment.username).subscribe(
      (user : User)=>{
        if (user){
          this.user = user;
        }
      }
    )

  }

}

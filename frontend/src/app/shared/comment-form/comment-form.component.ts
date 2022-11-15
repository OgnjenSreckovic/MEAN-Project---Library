import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/User';
import { Comment } from '../../models/Book';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  @Input() user: User;
  @Input() userComment: Comment;
  @Output() posted : EventEmitter<Comment> = new EventEmitter<Comment>();

  alreadyPosted: boolean;
  commentForm: FormGroup;

  get f() { return this.commentForm.controls; }

  constructor(
    private formBuilder : FormBuilder
  ) { }

  ngOnInit(): void {
    if (!this.userComment) {
      this.userComment = new Comment();
      this.userComment.username = this.user.username;
      this.userComment.text = "";
      this.userComment.date = new Date();
      this.userComment.review = 5;
      this.alreadyPosted = false;
    }else{
      this.alreadyPosted = true;
    }

    this.commentForm = this.formBuilder.group(
      {
        username: [this.userComment.username],
        text: [this.userComment.text, Validators.required],
        review: [this.userComment.review],
        date : [this.userComment.date]
      }
    )
  }

  post(){
    this.userComment.review = this.commentForm.controls.review.value;
    this.userComment.text = this.commentForm.controls.text.value;
    this.posted.emit(this.userComment);
  }

}

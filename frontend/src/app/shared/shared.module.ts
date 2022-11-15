import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookPreviewComponent } from './book-preview/book-preview.component';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BookFormComponent } from './book-form/book-form.component';
import { MatIconModule } from '@angular/material/icon';
import { EditBookComponent } from './edit-book/edit-book.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    BookPreviewComponent,
    CommentComponent,
    CommentFormComponent,
    BookFormComponent,
    EditBookComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  exports : [
    BookPreviewComponent,
    CommentComponent,
    CommentFormComponent,
    BookFormComponent,
    EditBookComponent,
    RegisterComponent
  ]
})
export class SharedModule { }

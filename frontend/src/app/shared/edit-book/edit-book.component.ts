import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Knjiga } from 'src/app/models/Book';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  @Input() book : Knjiga;
  @Output() edited : EventEmitter<Knjiga> = new EventEmitter<Knjiga>();

  form : FormGroup;

  get f() { return this.form.controls; }

  submitted: boolean = false;
  selectedFile: File = null;
  imageData: string;
  imageSrc : string;

  constructor(
    private formBuilder : FormBuilder,
    private bookService : BooksService
  ) { }

  ngOnInit(): void {
    this.imageSrc = this.book.image;

    this.form = this.formBuilder.group({
      title : [this.book.title, Validators.required],
      authors: [this.book.authors, Validators.required],
      genres: [this.book.genres, Validators.required],
      language: [this.book.language, Validators.required],
      publisher: [this.book.publisher, Validators.required],
      year: [this.book.year, Validators.required],
      availCopies: [this.book.availCopies]
    })

  }
  
  onSubmit(){
    this.submitted = true;
    if (this.form.invalid) return;
    

    let authors : string[];
    if (this.f.authors.value != this.book.authors){
      authors = [];
      this.f.authors.value.split(',').forEach(s => authors.push(s.trim()));
    } else authors = this.book.authors;

    let genres : string[];
    if (this.f.genres.value != this.book.genres){
      genres = [];
      this.f.genres.value.split(',').forEach(s => genres.push(s.trim()));
    } else genres = this.book.genres;


    this.bookService.editBook(
      this.book._id,
      this.f.title.value,
      authors,
      genres,
      this.f.language.value,
      this.f.publisher.value,
      this.f.year.value,
      this.f.availCopies.value
    ).subscribe((book : Knjiga)=>{
      if (!book) { 
        this.edited.emit(null);
        return;
      }

      this.book = new Knjiga(book);
      
      if (!this.selectedFile) {
        this.edited.emit(this.book);
        return;
      }

      this.bookService.setImage(this.book._id, this.book.image, this.selectedFile)
      .subscribe((book : Knjiga)=>{
        if (book) this.book = new Knjiga(book);
        this.edited.emit(this.book);
      });      
    })
  }


  onFileSelected(event){
    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
    
    if (this.selectedFile && allowedMimeTypes.includes(this.selectedFile.type)){
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      //this.zone.run(()=>{ 
          this.imageSrc = this.imageData; 
      //});        
      }
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
    //this.zone.run(()=>{ 
        this.imageSrc = this.book.image;
    //});
      alert("Dozvoljeni formati za sliku su PNG, JPG i JPEG");
    }

  }

  revertImage() {
    this.selectedFile = null;
  //this.zone.run(()=>{ 
      this.imageSrc = this.book.image;
  //});    
  }

  cancel(){
    this.edited.emit(null);
  }

}

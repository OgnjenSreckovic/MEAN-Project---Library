import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/User';
import { DEFAULT_BOOK_IMAGE, Knjiga } from '../../models/Book';
import { BooksService } from '../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  user : User;
  authorsString: string;
  genresString: string;


  form: FormGroup;
  get f() { return this.form.controls; }

  submitted: boolean = false;
  selectedFile: File = null;
  imageData: string;
  imageSrc : string;
  isMod: boolean;

  constructor(    
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bookService : BooksService,
  ) { }

  ngOnInit(): void {

    let userString = sessionStorage.getItem('user'); 
    if (userString == null){
      this.router.navigate(['/']);
    }else{
      this.user = User.fromString(userString);  
      this.isMod = (this.user.type == "moderator");
    }

    this.imageSrc = DEFAULT_BOOK_IMAGE;
    this.form = this.formBuilder.group({
      title : ['', Validators.required],
      authors: ['', Validators.required],
      genres: ['', Validators.required],
      language: ['', Validators.required],
      publisher: ['', Validators.required],
      year: ['', Validators.required],
      availCopies: ['1']
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
        this.imageSrc = DEFAULT_BOOK_IMAGE;
    //});
      alert("Dozvoljeni formati za sliku su PNG, JPG i JPEG");
    }

  }

  revertImage() {
    this.selectedFile = null;
  //this.zone.run(()=>{ 
      this.imageSrc = DEFAULT_BOOK_IMAGE;
  //});    
  }


  onSubmit(){
    this.submitted = true;
    if (this.form.invalid) return;

    if (this.isMod) this.addBook();
    else this.addBookRequest();

  }

  addBook(){
    // add book directly
    this.bookService.addBook({
      title       : this.form.controls.title.value.trim(),
      authors     : this.form.controls.authors.value,
      genres      : this.form.controls.genres.value,
      language    : this.form.controls.language.value.trim(),
      publisher   : this.form.controls.publisher.value.trim(),
      year        : this.form.controls.year.value,
      availCopies : this.form.controls.availCopies.value 
    }).subscribe((book : Knjiga) => {
      if (book) 
        if (this.selectedFile){
          console.log(book);
          this.bookService.setImage(book._id, book.image, this.selectedFile).subscribe((book : Knjiga)=>{
            this.router.navigate(['..', 'knjiga', book._id], {relativeTo: this.route});
          })   
        }else{
          this.router.navigate(['..', 'knjiga', book._id], {relativeTo: this.route});
        }
      else 
        alert("Greska pri menjanju podataka.");
    })
  }


  addBookRequest(){
    // add request with username of user who requested
    alert("nije implementirano");
  }

}

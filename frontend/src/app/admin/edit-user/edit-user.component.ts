import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  form: FormGroup = null;
  user: User;
  submitted: boolean = false;

  pwForm: FormGroup = null;  
  pwfSubmitted: boolean = false;
  passwordsMatching: boolean;
 
  private readonly passwordRegex = "(?=[a-zA-Z].*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,12}";

  private readonly phoneRegex = "[+]?[0-9]*";
  imageData: string;
  imageSrc : string;

  constructor(
    private userService : UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    let username;
    let segments : string[] = this.router.url.split("/");
    if (segments.length === 4) {
      alert(segments);
      if (segments[2] == "korisnik") {
        username = segments[3];
      }
    }

    this.userService.getUser(username).subscribe((user: User)=>{
      this.user = User.fromJSON(user);
      this.imageSrc = this.user.imagePath; 
      this.initForms();
    })
  }

  private initForms() {
    this.pwForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
        passwordConfirm: ['', Validators.required]
      }
    );

    this.pwForm.controls.passwordConfirm.addValidators(
      this.createCompareValidator(
        this.pwForm.controls.password, 
        this.pwForm.controls.passwordConfirm
      )
    );

    this.form = this.formBuilder.group(
      {
        username: [this.user.username, Validators.required],
        fullName: [this.user.fullName, Validators.required],
        address: [this.user.address, Validators.required],
        phone: [this.user.phone, [Validators.required, Validators.pattern(this.phoneRegex)]],
        email: [this.user.email, [Validators.required, Validators.email]],
        picture: [this.user.imagePath]
    });
  }

  get f() { return this.form.controls; }
  get pwf() { return this.pwForm.controls; }

  selectedFile = null;


  createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };
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
        this.imageSrc = this.user.imagePath; 
      //});
      alert("Dozvoljeni formati za prfilnu sliku su PNG, JPG i JPEG");
    }

  }

  revertImage() {
    this.selectedFile = null;
    //this.zone.run(()=>{ 
      this.imageSrc = this.user.imagePath;
    //});    
  }


  onSubmit(){
    this.submitted = true;
    if (this.form.invalid) return;

    this.userService.infoChangeCheck(
      this.user.username,
      this.form.controls.username.value,
      this.form.controls.email.value
    ).subscribe(
      (res : Response) => {
        if (res['status'] != 0){
          alert(res['message']);
        }else{
          this.userService.changeInfo(
            this.user.username,
            this.user.imagePath,
            this.form.controls.username.value,
            this.form.controls.fullName.value,
            this.form.controls.address.value,
            this.form.controls.phone.value,
            this.form.controls.email.value,
          ).subscribe((user : User) => {
            this.user = User.fromJSON(user);
            if (this.selectedFile){
              this.userService.changeProfilePicture(
                this.user.username, 
                this.user.imagePath, 
                this.selectedFile
              ).subscribe( 
                (user : User) => {
                  if (user != null) {
                    this.user = user;
                  }
                  this.selectedFile = null;
                  //this.zone.run(()=>{ 
                    this.imageSrc = this.user.imagePath;
                  // });    
                  alert("Promene su sa??uvane.");
                }
              )
            }else {
              this.selectedFile = null;
              //this.zone.run(()=>{ 
                this.imageSrc = this.user.imagePath;
              //});   
              alert("Promene su sa??uvane.");
            }
          })
        }
      }
    )
  }

  changePassword() {
    this.pwfSubmitted = true;
    if (this.pwForm.invalid) return;

    if (this.user.password !== this.pwf.oldPassword.value) {
      alert("molim vas unesite ispravnu trenutnu ??ifru.");
      return;
    };

    this.userService.changePassword(
      this.user.username,
      this.pwForm.controls.oldPassword.value,
      this.pwForm.controls.password.value
    ).subscribe(
      (user : User) => {
        if (!user){
          alert('Promena ??ifre neuspe??na!');
        }else{
          alert("Uspe??no ste promenili ??ifru korisniku.");
        }
      }
    );
  }
}

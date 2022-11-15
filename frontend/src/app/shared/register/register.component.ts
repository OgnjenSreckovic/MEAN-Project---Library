import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  passwordsMatching: boolean;

  private readonly passwordRegex = "(?=[a-zA-Z].*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,12}";
  private readonly phoneRegex = "[+]?[0-9]*";
  imageData: string;
  @Input() isAdmin: boolean = false;


  // just special chars: !@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?
  constructor(
    private userService : UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
        passwordConfirm: ['', Validators.required],
        fullName: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
        email: ['', [Validators.required, Validators.email]],
        picture: ['']
      }
    )
    
   
    this.form.controls.passwordConfirm.addValidators(
      this.createCompareValidator(
        this.form.controls.password, 
        this.form.controls.passwordConfirm
      )
    )
  }

  get f() { return this.form.controls; }

  selectedFile = null;

  onFileSelected(event){
    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
    
    if (this.selectedFile && allowedMimeTypes.includes(this.selectedFile.type)){
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      }
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      alert("Dozvoljeni formati za prfilnu sliku su PNG, JPG i JPEG");
    }

  }

  createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };
  }

 


  onSubmit(): void{
    this.submitted = true;
    if (this.form.invalid) return;
    this.userService.registerCheck(
      this.form.controls.username.value,
      this.form.controls.email.value
    ).subscribe(
      (res : Response) => {
        if (res['status'] != 0){
          alert(res['message']);
        }else{
          this.userService.register(
            "citalac",
            this.form.controls.username.value,
            this.form.controls.password.value,
            this.form.controls.fullName.value,
            this.form.controls.address.value,
            this.form.controls.phone.value,
            this.form.controls.email.value,
            this.selectedFile
          ).subscribe((user : User) => {
            // console.log(user);
            this.afterSuccess();
          })
        }
      }
    )
    /*     const user: User = {
        type: user.type,
        username: username,
        password: profileData.user.password,
        fullName : profileData.user.fullName,
        address : profileData.user.address,
        phone : profileData.user.phone,
        email : profileData.user.email,
        imagePath : profileData.user.imagePath,
      };
   */
    
  }

  afterSuccess(){
    if (this.isAdmin) this.router.navigate(["/admin/korisnici"]);
    else this.router.navigate(['/prijava']);
  }

}

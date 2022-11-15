import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  message: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private service : UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      }
    )
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.message = "";
    if (this.form.invalid){
      return;
    }

    this.service.login(
      this.form.controls.username.value, 
      this.form.controls.password.value
    ).subscribe(
      (user: User) => {
        if (user){
          if (user.status == 'prihvacen'){
            sessionStorage.setItem("user", JSON.stringify(User.fromJSON(user)));
            if (user.type == 'citalac'){
              this.router.navigate(["/citalac"], )
              .then(() => {
                window.location.reload();
              });
            }else if (user.type == "moderator"){
              this.router.navigate(["/moderator"])
              .then(() => {
                window.location.reload();
              });
            }
            return;
          }
          if (user.status == 'kreiran') {
            this.message = "Vas zahtev za registraciju jos uvek nije prihvacen od strane administratora."
            return;
          }
          if (user.status == 'odbijen'){
            this.message = "Vas zahtev za registraciju je odbijen od strane administratora."
          }

        }else{
          this.message = "Neispravni kredencijali.";
        }
      }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';
import { User } from '../../models/User';
import { AdminService } from '../../services/admin.service';

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
    private menuComponent : MenuComponent,
    private formBuilder: FormBuilder,
    private service : AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let admin = sessionStorage.getItem("admin");
    if (admin) {
      this.router.navigate(["admin/korisnici"]);
    }
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
      (res) => {
        if (res) {
          sessionStorage.setItem("admin", "1");      
         
          this.menuComponent.refreshMenuItems();
         
          this.router.navigate(["admin/korisnici"]);
        }else{
          this.message = "Neispravni kredencijali";
        }
      }
    )
  }
}

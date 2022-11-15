import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];
  columnsToDisplay = ['username', 'fullName', 'address', 'phone', 'email', 'type', 'status', 'delete', 'edit'];
  requests: User[];
  columnsToDisplayRequests = ['username', 'fullName', 'address', 'phone', 'email', 'type', 'status', 'accept', 'decline'];
  

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.userService.getAllUsers().subscribe((users: User[])=>{
      this.users = [];
      this.requests = [];
      users.forEach(u=>{
        let user = User.fromJSON(u);
        this.users.push(user);
        if (u.status=="kreiran") this.requests.push(user);
      });
    });
  }

  delete(user: User){ 
    this.userService.delete(user.username).subscribe(
      (res) => {
        this.getUsers();
      }
    )
  }

  
  edit(user: User){
    this.router.navigate(["admin", "korisnik", user.username]);
  }

  accept(user: User){
    this.userService.accept(user.username).subscribe((res)=>{
      this.getUsers();
    })
  }

  decline(user: User){
    this.userService.decline(user.username).subscribe((res)=>{
      this.getUsers();
    })
  }

}

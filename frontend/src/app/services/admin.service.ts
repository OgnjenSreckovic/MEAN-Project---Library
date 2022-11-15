import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  readonly url = "http://localhost:4000/admin/";

  constructor(private http: HttpClient) { }

  login(username: string, password: string){
    return this.http.post(
      `${this.url}login`, 
      {"username" : username, "password" : password }
    );
  }

  getRentPeriod(){
    return this.http.get(`${this.url}getRentPeriod`);
  }
  
  setRentPeriod(rentPeriod : number){
    return this.http.post(`${this.url}setRentPeriod`, { rentPeriod : rentPeriod});
  }
  
}

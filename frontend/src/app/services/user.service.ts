import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RentedBook, User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  readonly url = "http://localhost:4000/users/";

  constructor(private http: HttpClient) { }

  register(type, username, pasword, fullName, address, phone, email, imgFile : File) {
    const profileData = new FormData();
    profileData.append("type", type);
    profileData.append("username", username);
    profileData.append("password", pasword);
    profileData.append("fullName", fullName);
    profileData.append("address", address);
    profileData.append("phone", phone);
    profileData.append("email", email);
    if (imgFile){
      profileData.append("image", imgFile, username);
    }

    return this.http.post(`${this.url}register`, profileData);      
  }

  registerCheck(username: string, email: string) {
    let data = {
      "username" : username,
      "email" : email
    }
    return this.http.post(`${this.url}registerCheck`, data);
  }

  login(username: string, password: string){
    let data = {
      "username" : username,
      "password" : password
    }
    return this.http.post(`${this.url}login`, data);
  }

  changePassword(username: string, oldPassword: string, newPassword: string){
    let data = {
      "username" : username,
      "oldPassword" : oldPassword,
      "newPassword" : newPassword 
    }
    return this.http.post(`${this.url}changePassword`, data);
  }

  infoChangeCheck(username: string, newUsername: string, newEmail: string) {
    let data = {
      "username" : username,
      "newUsername" : newUsername,
      "newEmail" : newEmail 
    }
    return this.http.post(`${this.url}infoChangeCheck`, data);
  }

  changeInfo(
    oldUsername : string,
    imagePath : string,
    username : string, 
    fullName : string, 
    address : string, 
    phone : string, 
    email : string, 
  ){
    let data = {
      "oldUsername" : oldUsername,
      "imageUrl" : imagePath,
      "username" : username,
      "fullName" : fullName,
      "address" : address,
      "phone" : phone,
      "email": email,
    }

    return this.http.post(`${this.url}changeInfo`, data);      
  }
  
  changeProfilePicture(username : string, oldImagePath: string, imgFile : File){
    const profileData = new FormData();
    profileData.append("username", username);
    profileData.append("oldImagePath", oldImagePath);

    if (imgFile){
      profileData.append("image", imgFile, username);
    }
    return this.http.post(`${this.url}changeProfilePicture`, profileData);      
  }

  rent(username : string, bookId : string){
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let data = {
      username    : username,
      bookId      : bookId,
      dateRented  : today
    };
    return this.http.post(`${this.url}rentBook`, data);
  }

  getUser(username: string){
    return this.http.get(`${this.url}getUser`, { params: {"username" : username} });
  }

  returnBook(username: string, rentInfo : RentedBook){
    
    let data = {
      username : username,
      rentInfo : rentInfo
    };

    return this.http.post(`${this.url}returnBook`, data);
  }


  getAllUsers(){
    return this.http.get(`${this.url}getAllUsers`);
  }

  delete(username: string){
    return this.http.post(`${this.url}delete`, { username : username });
  }

  setStatus(username: string, status: string){
    return this.http.post(`${this.url}setStatus`,
     { username : username, status: status });
  }

  accept(username:string){
    return this.setStatus(username, "prihvacen");
  }

  decline(username:string){
    return this.setStatus(username, "odbijen");
  }


}



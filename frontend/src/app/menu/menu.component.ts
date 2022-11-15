import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  menuItems : Object[] = [];
  canLogout : boolean = false;
  hasProfile: boolean = false;
  profileLink: string;
  profileImagePath : string;

  ngOnInit(): void {
    this.refreshMenuItems();
  }

  public refreshMenuItems(){
    this.menuItems = [];
    let userString = sessionStorage.getItem('user'); 
    if (userString == null){
      let admin = sessionStorage.getItem('admin');
      if (admin) {
        this.hasProfile = false;
        this.canLogout = true;
        this.menuItems.push({ "label" : "Korisnici", "link" : "admin/korisnici" });          
        this.menuItems.push({ "label" : "Knjige", "link" : "admin/knjige" });    
      } else {
        this.menuItems.push({ "label" : "Početna", "link" : "pocetna" });
        this.menuItems.push({ "label" : "Pretraga", "link" : "pretraga" })
        this.menuItems.push({ "label" : "Prijava", "link" : "prijava" });
        this.menuItems.push({ "label" : "Registracija", "link" : "registracija" });
      }
    }else{
      let user : User = JSON.parse(userString);
      this.canLogout = true;
      this.hasProfile = true;
      this.profileImagePath = user.imagePath;
      this.profileLink = `${user.type}/profil`;

      switch (user.type) {
        case 'moderator':
          this.menuItems.push({ "label" : "Početna", "link" : "moderator/pocetna" });
          this.menuItems.push({ "label" : "Pretraga", "link" : "moderator/pretraga" });
          this.menuItems.push({ "label" : "Nova knjiga", "link" : "moderator/nova-knjiga" });
          this.menuItems.push({ "label" : "Zaduzene knjige", "link" : "moderator/zaduzene" });
          this.menuItems.push({ "label" : "Istorija zaduzenja", "link" : "moderator/istorija" });
          break;

        case 'citalac':
          this.menuItems.push({ "label" : "Početna", "link" : "citalac/pocetna" });
          this.menuItems.push({ "label" : "Pretraga", "link" : "citalac/pretraga" });
          this.menuItems.push({ "label" : "Nova knjiga", "link" : "citalac/nova-knjiga" });
          this.menuItems.push({ "label" : "Zaduzene knjige", "link" : "citalac/zaduzene" });
          this.menuItems.push({ "label" : "Istorija zaduzenja", "link" : "citalac/istorija" });
          break;
      }
      /*
      if (user.type == 'citalac'){
        this.menuItems.push({ "label" : "Početna", "link" : "citalac/pocetna" });
        this.menuItems.push({ "label" : "Pretraga", "link" : "citalac/pretraga" });
        this.menuItems.push({ "label" : "Nova knjiga", "link" : "citalac/nova-knjiga" });
        this.menuItems.push({ "label" : "Zaduzene knjige", "link" : "citalac/zaduzene" });
        this.menuItems.push({ "label" : "Istorija zaduzenja", "link" : "citalac/istorija" });
      }else{
        this.menuItems.push({ "label" : "Početna", "link" : "moderator/pocetna" });
        this.menuItems.push({ "label" : "Pretraga", "link" : "moderator/pretraga" });
        this.menuItems.push({ "label" : "Nova knjiga", "link" : "moderator/nova-knjiga" });
        this.menuItems.push({ "label" : "Zaduzene knjige", "link" : "moderator/zaduzene" });
        this.menuItems.push({ "label" : "Istorija zaduzenja", "link" : "moderator/istorija" });
      }
      */
    }
  }
  

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private router : Router,
    private breakpointObserver: BreakpointObserver) {}


  public logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('admin');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
    
  }
}

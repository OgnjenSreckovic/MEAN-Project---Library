import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-rent-period-setter',
  templateUrl: './rent-period-setter.component.html',
  styleUrls: ['./rent-period-setter.component.css']
})
export class RentPeriodSetterComponent implements OnInit {

  currPeriod : number;
  form: FormGroup;

  constructor(
    private adminService : AdminService,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      newPeriod: [""]
    })

    this.adminService.getRentPeriod().subscribe(
      (period : number)=>{
        this.currPeriod = period;
        this.form.controls.newPeriod.setValue(period);
      }
    );
  }

  setRentPeriod(){
    this.adminService.setRentPeriod(this.form.controls.newPeriod.value).subscribe(
      (res)=>{
        this.currPeriod = this.form.controls.newPeriod.value;
      }
    )
  }

}

import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/service/supabase.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  Email:string = ""
  Password:string = ""
  showPassword: boolean = false;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private supabase:SupabaseService, private router:Router, private snackbar:MatSnackBar) {
    this.IsUserLoggedIn()
  }

  async LoginUser() {
    const result = await this.supabase.SignIn(this.Email, this.Password)
    
    if (result.error == null) {
      this.snackbar.open(`Successfully logged in as ${this.Email}`, "", {duration:5000})
      this.router.navigate(['/'])
    }
    else {
      this.snackbar.open(`Wrong username or password!`, "", {duration:5000})
    }
  }

  async IsUserLoggedIn() {
    const result = await this.supabase.MyID()
    if (result != undefined && result != null) {
      this.snackbar.open(`You are already logged in! Logout in order to login again!`, "", {duration:5000})
      this.router.navigate(['/'])
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}

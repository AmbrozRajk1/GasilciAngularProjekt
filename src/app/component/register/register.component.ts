import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from 'src/app/service/supabase.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  Email:string = ""
  Password:string = ""
  showPassword: boolean = false;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private supabase:SupabaseService, private snackbar:MatSnackBar) {

  }

  async RegisterNewUser() {
    const result = await this.supabase.SignUp(this.Email, this.Password)

    if (result.error == null) {
      this.snackbar.open(`Register of user with email ${this.Email} was successful! Please verify your email before you can login.`, "", {duration:5000})
    } else {
      this.snackbar.open(`Something wen't wrong during registration!`, "", {duration:5000})
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
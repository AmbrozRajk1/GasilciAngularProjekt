import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/service/supabase.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent {
  FirstName: string = ""
  LastName: string = ""
  Gender: string = "Male"
  Rank: string = "Probationary Firefighter"
  DateOfBirth: Date = new Date()
  Address: string = ""
  CardNumber: string = ""
  ValidTo: Date = new Date()
  ThumbnailURL: string = ""
  srcResult: any;

  constructor(private supabase: SupabaseService, private router: Router, private snackbar: MatSnackBar) {
    this.IsUserLoggedIn()
  }

  async IsUserLoggedIn() {
    const result = await this.supabase.MyID()
    if (result == undefined || result == null) {
      this.snackbar.open(`Please login to add new firefighter!`, "", { duration: 5000 })
      this.router.navigate(['/login'])
    }
  }

  async NewUser() {
    if (this.FirstName == "" || this.LastName == "" || this.Gender == "" || this.Rank == "" || this.Address == "" || this.CardNumber == "") {
      this.snackbar.open(`One ore more fields are blank. Please insert data in all fields.`, "", { duration: 5000 })
    }
    else {
      if (document.getElementById("img_upload")) {
        const imageName = await this.supabase.UploadImage(document.getElementById("img_upload") as HTMLInputElement)
        if (imageName) {
          const imagePath = await this.supabase.GetImageURL(imageName)
          console.log(imagePath)
          const success = await this.supabase.AddUserToDB(this.FirstName, this.LastName, this.Gender, this.Rank, this.DateOfBirth, this.Address, this.CardNumber, this.ValidTo, imagePath)

          if (success) {
            this.snackbar.open(`Firefigter ${this.FirstName} ${this.LastName} successfully added to database!`, "", { duration: 5000 })
          }
          else {
            this.snackbar.open(`There was and error adding new user to database!`, "", { duration: 5000 })
            const imageName = imagePath.split('/').pop();
            await this.supabase.DeleteImage(imageName as string)
          }
        }
      }
    }
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    input.value = value.replace(/[^0-9]/g, '');
  }
}
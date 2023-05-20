import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { SupabaseService } from 'src/app/service/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  Dashboard: any[] = []

  constructor(private supabase: SupabaseService, private snackbar:MatSnackBar, private router:Router) {
    this.IsUserLoggedIn()
    this.GetFirefighters()
  }

  async IsUserLoggedIn() {
    const result = await this.supabase.MyID()
    if (result == undefined || result == null) {
      this.snackbar.open(`Please login to view homepage!`, "", {duration:5000})
      this.router.navigate(['/login'])
    }
  }

  async GetFirefighters() {
    const query = await this.supabase.GetAllFirefigters()
    this.Dashboard = query as any[]
  }

  async DeleteUser(ID:any, FirstName:any, LastName:any, ThumbnailURL:any) {
    const result = await this.supabase.RemoveFirefighter(ID as number, ThumbnailURL as string)
    if (result) {
      this.snackbar.open(`Firefighter ${FirstName as string} ${LastName as string} successfully deleted from database.`, "", {duration:5000})
      await this.GetFirefighters()
    }
    else {
      this.snackbar.open(`There was a problem deleting firefighter ${FirstName as string} ${LastName as string} from database.`, "", {duration:5000})
    }
  }
}

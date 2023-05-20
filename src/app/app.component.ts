import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './service/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PGDGabrje';

  constructor(private supabase:SupabaseService, private router:Router) {
    
  }

  async SignOutUser() {
    await this.supabase.LogOut()
    this.router.navigate(['/login'])
  }
}

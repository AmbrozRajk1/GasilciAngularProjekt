import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js'

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabaseUrl = 'https://bfztspdbxhankbetzjfu.supabase.co'
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmenRzcGRieGhhbmtiZXR6amZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0MTc2NTUsImV4cCI6MTk5OTk5MzY1NX0.sSW00HzsRLvkgTaWz0DsrzPMKM8X9UpNfS-6gvl-1aQ'
  supabase = createClient(this.supabaseUrl, this.supabaseKey)

  constructor(private router: Router, private snackbar: MatSnackBar) { }

  async SignUp(Email: string, Passsword: string) {
    return await this.supabase.auth.signUp({
      email: Email,
      password: Passsword
    })
  }

  async SignIn(Email: string, Passsword: string) {
    return await this.supabase.auth.signInWithPassword({
      email: Email,
      password: Passsword
    })
  }

  async UploadImage(input: HTMLInputElement) {
    if (input.files != null) {
      const image = input.files[0]
      const response = await this.supabase.storage.from("images").upload(image.name, image)
      return await response.data?.path
    }
    else {
      throw new Error("Couldn't upload image!")
    }
  }

  async DeleteImage(imageName: string) {

    const response = await this.supabase.storage.from("images").remove([imageName])
    if (response.error == null) {
      return await response.data
    }
    else {
      throw new Error("Couldn't delete image!")
    }
  }

  async AddUserToDB(FirstName: string, LastName: string, Gender: string, Rank: string, DateOfBirth: Date, Address: string, CardNumber: string, ValidTo: Date, ThumbnailURL: string) {
    const { data, error } = await this.supabase
      .from('Gasilec')
      .insert([
        { FirstName: FirstName, LastName: LastName, Gender: Gender, Rank: Rank, DateOfBirth: DateOfBirth, Address: Address, CardNumber: CardNumber, ValidTo: ValidTo, ThumbnailURL: ThumbnailURL }
      ])

    return error == null
  }

  async MyID() {
    const user = await this.supabase.auth.getUser()
    return user.data.user?.id
  }

  async GetImageURL(ImageName: string) {
    const { data } = this.supabase
      .storage
      .from('images')
      .getPublicUrl(ImageName)

    return data.publicUrl
  }

  async GetAllFirefigters() {
    let { data, error } = await this.supabase
      .from('Gasilec')
      .select('*')

    return data
  }

  async RemoveFirefighter(ID: number, ThumbnailURL: string) {
    const imageName = ThumbnailURL.split('/').pop();
    this.DeleteImage(imageName as string)
    const { data, error } = await this.supabase
      .from('Gasilec')
      .delete()
      .eq("ID", ID)

    return error == null
  }

  async LogOut() {
    const result = await this.supabase.auth.signOut()
    this.snackbar.open(`Logout was successful!`, "", { duration: 5000 })
    this.router.navigate(['/login'])
    return result == null
  }
}
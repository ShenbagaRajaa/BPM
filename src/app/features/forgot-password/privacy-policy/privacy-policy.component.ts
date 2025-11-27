import { NgIf } from '@angular/common';
import { Component, Optional } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [MatCardModule,MatDialogModule, NgIf],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {
  hideFooter: boolean = false;

  constructor(@Optional() private dialogRef : MatDialogRef<PrivacyPolicyComponent>){
    if(this.dialogRef){
      this.hideFooter = true;
    }
  }

  onAgree(){
    this.dialogRef.close(true);
  }
}

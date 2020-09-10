import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-marks-card',
  templateUrl: './marks-card.component.html',
  styleUrls: ['./marks-card.component.scss']
})
export class MarksCardComponent implements OnInit {
  studentId = 'S_001';

  constructor(public dialogRef: MatDialogRef<MarksCardComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

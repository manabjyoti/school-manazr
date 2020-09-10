import { Component, OnInit, Input } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { ViewCell } from 'ng2-smart-table';
@Component({
  selector: 'app-grade-select',
  templateUrl: './grade-select.component.html',
  styleUrls: ['./grade-select.component.scss']
})
export class GradeSelectComponent implements OnInit, ViewCell {
   gradeArray = [];
  // constructor(private gradeService: GradeService) { }
  // @Input() value;
  // @Input() rowData;
  // ngOnInit(): void {
  //   this.getList();
  //   console.log(this.value);
  // }

  // getList(){
  //   this.gradeService.listGrade().subscribe( (res: any) => {
  //     this.gradeArray = res.data;
  //   });
  // }

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

}

import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { LocalDataSource } from 'ng2-smart-table';
import { RouterLinkComponent, RouterLinkFullNameComponent } from '../../router-link/router-link.component';
import { StudentService } from 'src/app/services/student.service';
import {isEmpty, mapKeys, camelCase} from 'lodash';
import { ApiResponse } from 'src/app/models/models';

@Component({
  selector: 'app-add-student-excel',
  templateUrl: './add-student-excel.component.html',
  styleUrls: ['./add-student-excel.component.scss']
})
export class AddStudentExcelComponent implements OnInit {
  tableData: any;
  validRows = 0;
  settings = {
    columns: {
      Check: {
        title: 'Check',
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return cell === 1 ?
          '<span class="text-success"><i class="mdi mdi-checkbox-marked-circle"></i> Added</span>' : cell === 0 ? '<span class="text-danger"><i class="mdi mdi-close-circle"></i> Failed</span>' :
          '<span class="text-black-50"><i class="mdi mdi-adjust"></i> Unknown</span>';
        },
      },
      ApplicationNo: {
        title: 'Appln No.',
      },
      FirstName: {
        title: 'First Name',
      },
      LastName: {
        title: 'Last Name',
      },
      GradeId: {
        title: 'Grade',
        type: 'html',
        valuePrepareFunction: ((cell) => {
          return isEmpty(cell) ? '<i class="h3-responsive mdi mdi-information text-danger"></i>' : cell;
        })
      },
      Sex: {
        title: 'Sex',
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return `<i class="h3-responsive mdi mdi-human-${cell} ${cell === 'male' ? 'text-dark' : 'text-info'}"></i>`;
        },
      },
      DOP: {
        title: 'DOB',
      },
      POB: {
        title: 'POB',
      },
      Address: {
        title: 'Address',
      },
      FatherFirstName: {
        title: 'Father Name',
      },
      FatherLastName: {
        title: 'Father Name',
      },
      MotherFirstName: {
        title: 'Mother Name',
      },
      MotherLastName: {
        title: 'Mother Name',
      },
      MobilePhone: {
        title: 'Mobile'
      },
      RollNo: {
        title: 'Roll No',
        valuePrepareFunction: ( cell, row ) => {
          return cell !== 0 ? cell : '';
        },
      },
      Caste: {
        title: 'Caste'
      },
    },
    rowClassFunction: (row) => {
      if (isEmpty(row.data.GradeId)){
          return 'bg-inverse-danger';
      } else {
          return 'bg-white';
      }
    },
    actions: false,
    attr: {
      class: 'table table-bordered text-capitalize',
      id: 'StudentTable'
    }
  };

  source: LocalDataSource;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      this.tableData = jsonData[Object.keys(jsonData)[0]];
      this.source = new LocalDataSource(this.tableData);
      const dataString = JSON.stringify(jsonData);
      // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat('...');

      // this.source = new LocalDataSource(dataString);
      // this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
  }

  addStudents(){
    // console.log(this.tableData);
    this.tableData.map((model, index) => {
      const modelData = mapKeys(model, (v, k) => camelCase(k));
      modelData.fatherfn = modelData.fatherFirstName;
      modelData.fatherln = modelData.fatherLastName;
      modelData.motherfn = modelData.motherFirstName;
      modelData.motherln = modelData.motherLastName;
      // modelData.dob = JSON.stringify(new Date(modelData.dob));
      modelData.status = 0;
      console.log(modelData);
      this.fetchData(modelData, index);
      // this.studentService.addStudent(modelData).subscribe(
      //   (res: any) => {
      //     console.log(modelData.firstName + '------' + res);
      //     this.tableData[index].Check = res.status;
      //     this.source.refresh();
      //   }
      // );
    });
  }

  private async fetchData(modelData, index){
    const data = await this.studentService.addStudent(modelData).toPromise();
    if (data.status === 1) {
      this.validRows++;
    }
    this.tableData[index].Check = data.status;
    this.source.refresh();
  }

}

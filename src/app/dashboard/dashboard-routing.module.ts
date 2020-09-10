import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../_helper/auth.guard';
import { StaffTypeComponent } from './staff/staff-type/staff-type.component';
import { AddStaffComponent } from './staff/add-staff/add-staff.component';
import { ListStaffComponent } from './staff/list-staff/list-staff.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { ListStudentComponent } from './student/list-student/list-student.component';
import { ListGradeComponent } from './grade/list-grade/list-grade.component';
import { SubjectListComponent } from './subject/subject-list/subject-list.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { AssignmentComponent } from './staff/assignment/assignment.component';
import { ViewGradeComponent } from './grade/view-grade/view-grade.component';
import { ListStaffTypeComponent } from './staff/list-staff-type/list-staff-type.component';
import { ManageComponent } from './account/manage/manage.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { ClassComponent } from './class/class.component';
import { SettingsComponent } from './global/settings/settings.component';

const ExamModule = () => import('../exam/exam.module').then(x => x.ExamModule);
const FeeModule = () => import('../fee/fee.module').then(x => x.FeeModule);
const LeaveModule = () => import('../leave/leave.module').then(x => x.LeaveModule);
const AttendenceModule = () => import('../attendence/attendence.module').then(x => x.AttendenceModule);
const RoutineModule = () => import('../routine/routine.module').then(x => x.RoutineModule);


const routes: Routes = [
  { path: '', component: DashboardLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'manage-account', component: ManageComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'staff-type', component: ListStaffTypeComponent},
      { path: 'staff', component: ListStaffComponent},
      { path: 'staff/add', component: AddStaffComponent},
      { path: 'staff/view/:id', component: AddStaffComponent },
      { path: 'staff/assign/:id', component: AssignmentComponent },
      { path: 'student/add', component: AddStudentComponent},
      { path: 'student/view/:sid', component: AddStudentComponent},
      { path: 'student', component: ListStudentComponent},
      { path: 'grade', component: ListGradeComponent},
      { path: 'class', component: ClassComponent},
      { path: 'grade/view/:gid', component: ViewGradeComponent},
      { path: 'subject', component: SubjectListComponent},
      { path: 'exam', loadChildren: ExamModule},
      { path: 'fee', loadChildren: FeeModule},
      { path: 'leave', loadChildren: LeaveModule},
      { path: 'attendence', loadChildren: AttendenceModule},
      { path: 'settings', component: SettingsComponent},
      { path: 'routine', loadChildren: RoutineModule},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

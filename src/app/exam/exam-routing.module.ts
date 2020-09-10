import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateExamComponent } from './create-exam/create-exam.component';
import { ResultComponent } from './result/result.component';
import { MarksComponent } from './marks/marks.component';


const routes: Routes = [
  {path: '', component: CreateExamComponent},
  {path: 'marks', component: MarksComponent},
  {path: 'result', component: ResultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }

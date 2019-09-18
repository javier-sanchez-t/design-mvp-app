import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProjectCComponent } from './new-project-c/new-project-c.component';
import { VersionCComponent } from './version-c/version-c.component';

const routes: Routes = [
  { path: '', component: NewProjectCComponent },
  { path: ':projectName', component: VersionCComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

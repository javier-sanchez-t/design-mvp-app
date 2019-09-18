import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewProjectCComponent } from './new-project-c/new-project-c.component';
import { VersionCComponent } from './version-c/version-c.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { RestApiService } from './services/RestApiService';
import { HttpClientModule } from '@angular/common/http';
import { Config } from './config/Config';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NewProjectCComponent,
    VersionCComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxFileDropModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    RestApiService,
    Config
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

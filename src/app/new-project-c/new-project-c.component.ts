import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/RestApiService';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-project-c',
  templateUrl: './new-project-c.component.html',
  styleUrls: ['./new-project-c.component.css']
})
export class NewProjectCComponent implements OnInit {

  constructor(
    private api: RestApiService,
    private router: Router) { }

  ngOnInit() {
  }

  project: any = {
    projectName: null,
    initialDesign: null
  };

  createProject() {
    this.api.createProject(this.project).subscribe(
      success => {
        console.log("success", success);
        this.router.navigate([this.project.projectName]);
      },
      error => {
        console.log("error", error);
      }
    );
  }


  files: NgxFileDropEntry[] = [];

  dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          var myReader: FileReader = new FileReader();
          myReader.onloadend = (e) => {
            //this.project.initialdesign = myReader.result;
            var imageB64 = myReader.result+"";
            var breakIndex = imageB64.indexOf(",");
            imageB64 = imageB64.substr(breakIndex+1, imageB64.length);
            this.project.initialDesign = imageB64;
            console.log("result", this.project);
          }
          myReader.readAsDataURL(file);
        });
      }
    }
  }



}

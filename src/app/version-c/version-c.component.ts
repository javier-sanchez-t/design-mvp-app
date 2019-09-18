import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../services/RestApiService';

@Component({
  selector: 'app-version-c',
  templateUrl: './version-c.component.html',
  styleUrls: ['./version-c.component.css']
})
export class VersionCComponent implements OnInit {
  protected projectName: string;

  constructor(
    private route: ActivatedRoute,
    private api: RestApiService
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectName = params.projectName;
    });

    this.api.getVersionByProjectName(this.projectName).subscribe(
      success =>{

      },
      error=>{

      }
    );
  }
  
}
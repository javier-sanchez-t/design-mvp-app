import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../services/RestApiService';
import * as Konva from '../../assets/js/konva.js';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-version-c',
  templateUrl: './version-c.component.html',
  styleUrls: ['./version-c.component.css']
})
export class VersionCComponent implements OnInit {
  protected projectName: string;
  protected versionName: string;
  version: any = null;
  stage = null;
  layer = null;
  commentSelected;

  constructor(
    private route: ActivatedRoute,
    private api: RestApiService,
    private router: Router
  ) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectName = params.projectName;
      this.versionName = params.versionName == undefined ? "" : params.versionName;
      this.initComponent(this.projectName, this.versionName);
    });

  }

  initComponent(projectName: string, versionName: string) {
    console.log("Init component");

    this.api.getVersionByProjectName(projectName, versionName).subscribe(
      success => {
        console.log("VERSION: ", success);

        this.version = success;
        this.initDesign();
      },
      error => {
        console.log("Error: ", error);
      }
    );
  }


  initDesign() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.stage = new Konva.Stage({
      container: 'container',
      width: width / 2,
      height: height
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    let numCommentsSaved = this.version.lastVersion.comments.length;
    for (let i = 0; i < numCommentsSaved; i++) {
      let comment = this.version.lastVersion.comments[i];
      this.version.lastVersion.comments[i].id = i;
      this.addRectToLayer(comment.x, comment.y, comment.width, comment.height, comment.name, i, comment.draggable, comment.stroke);
    }
  }

  addRectToLayer(x_, y_, width_, height_, name_, numComment_, draggable_, stroke_) {
    let rect = new Konva.Rect({
      x: x_,
      y: y_,
      width: width_,
      height: height_,
      name: name_,
      id: numComment_,
      draggable: draggable_,
      stroke: stroke_
    });

    this.layer.add(rect);
    this.layer.draw();

    rect.addEventListener("click", () => {
      this.clickRectComment(numComment_);
    });
  }

  addComment(x_, y_, width_, height_, name_, numComment_, draggable_, stroke_) {
    this.addRectToLayer(x_, y_, width_, height_, name_, numComment_, draggable_, stroke_);
    //this.version.lastVersion.comments.unshift({ id: this.version.lastVersion.comments.length, name: '', comment: '' });
    this.version.lastVersion.comments.push({ id: this.version.lastVersion.comments.length, name: '', comment: '' });
  }


  clickRectComment(numComment) {
    this.stage.on('click tap', (e) => {
      this.commentSelected = numComment;
      console.log("commented: ", this.commentSelected);
      
      // if click on empty area - remove all transformers
      if (e.target === this.stage) {
        this.stage.find('Transformer').destroy();
        this.layer.draw();
        return;
      }

      // remove old transformers
      // TODO: we can skip it if current rect is already selected
      this.stage.find('Transformer').destroy();

      // create new transformer
      var tr = new Konva.Transformer();
      this.layer.add(tr);
      tr.attachTo(e.target);
      this.layer.draw();
    });
  }


  saveComment(comment: any) {
    let scaleX = this.layer.children[comment.id].attrs.scaleX == undefined ? 1 : this.layer.children[comment.id].attrs.scaleX;
    let scaleY = this.layer.children[comment.id].attrs.scaleY == undefined ? 1 : this.layer.children[comment.id].attrs.scaleY;

    let newComment = {
      "name": comment.name,
      "comment": comment.comment,
      "project": {
        "idProject": this.version.lastVersion.project.idProject
      },
      "version": {
        "idVersion": this.version.lastVersion.idVersion
      },
      "commentBean": null,
      "x": this.layer.children[comment.id].attrs.x,
      "y": this.layer.children[comment.id].attrs.y,
      "width": this.layer.children[comment.id].attrs.width * scaleX,
      "height": this.layer.children[comment.id].attrs.height * scaleY,
      "draggable": false,
      "stroke": "orange"
    }

    this.api.saveComment(newComment).subscribe(
      success => {
        this.version.lastVersion.comments[comment.id] = success;
        console.log("EXITO: ", success);
      },
      error => {
        console.log("ERROR: ", error);
      }
    );
  }


  saveReplyComment(idComment: any, replyComment: any, parentComment: any) {
    let newComment = {
      "comment": replyComment,
      "commentBean": {
        "idComment": idComment
      }
    }

    this.api.saveReplyComment(newComment).subscribe(
      success => {
        console.log("EXITO: ", success);
        if (parentComment.replyComments == null) {
          parentComment.replyComments = [];
        }
        parentComment.replyComments.push(newComment);
        parentComment.replyComment="";
      },
      error => {
        console.log("ERROR: ", error);
      }
    );

  }


  approveVersion(status: boolean) {
    this.api.approveVersion(this.version.lastVersion.idVersion, status).subscribe(
      success => {
        this.version.lastVersion.approved = status;
      },
      error => {
        console.log("ERROR: ", error);
      }
    );
  }

  //RESOLVE COMMENT
  resolveComment(comment:any){
    this.api.resolveComment(comment.idComment).subscribe(
      success=>{
        console.log("RESOLVE: ", success);
        comment.solved = success;
      },
      error=>{
        console.log("RESOLVE: ", error);
        
      }
    );
  }


  //NEW VERSION
  files: NgxFileDropEntry[] = [];
  newVersion = {
    approved: false,
    design: null,
    project: null
  }

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
            var imageB64 = myReader.result + "";
            var breakIndex = imageB64.indexOf(",");
            imageB64 = imageB64.substr(breakIndex + 1, imageB64.length);
            this.newVersion.design = imageB64;
            console.log("result", this.newVersion.design);
          }
          myReader.readAsDataURL(file);
        });
      }
    }
  }

  uploadNewVersion() {
    this.newVersion.project = this.version.lastVersion.project;
    console.log("new version: ", this.newVersion);
    this.api.saveNewVersion(this.newVersion).subscribe(
      success => {
        console.log("Success: ", success);
        this.initComponent(this.version.lastVersion.project.name, "");
        this.files = [];
      },
      error => {
        console.log("error: ", error);
      }
    );
  }

  goToVersion(version: any) {
    this.initComponent(this.version.lastVersion.project.name, version.version);
  }

}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../services/RestApiService';
import * as Konva from '../../assets/js/konva.js';

@Component({
  selector: 'app-version-c',
  templateUrl: './version-c.component.html',
  styleUrls: ['./version-c.component.css']
})
export class VersionCComponent implements OnInit {
  protected projectName: string;
  version: any = null;
  stage = null;
  layer = null;
  commentSelected;

  constructor(
    private route: ActivatedRoute,
    private api: RestApiService
  ) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectName = params.projectName;
    });

    this.api.getVersionByProjectName(this.projectName).subscribe(
      success => {
        console.log("Success: ", success);
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
      "width": this.layer.children[comment.id].attrs.width * this.layer.children[comment.id].attrs.scaleX,
      "height": this.layer.children[comment.id].attrs.height * this.layer.children[comment.id].attrs.scaleY,
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


  approveVersion(){
    this.api.approveVersion(this.version.lastVersion.idVersion, true).subscribe(
      success=>{
        console.log("SUCCESS: ", success);
        this.version.lastVersion.approved = true;
      }, 
      error=>{
        console.log("ERROR: ", error);
      }
    );
  }


  undoApprovalVersion(){
    this.api.approveVersion(this.version.lastVersion.idVersion, false).subscribe(
      success=>{
        console.log("SUCCESS: ", success);
        this.version.lastVersion.approved = false;
      }, 
      error=>{
        console.log("ERROR: ", error);
      }
    );
  }

}
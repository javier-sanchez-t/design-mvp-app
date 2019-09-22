import { Injectable } from '@angular/core';
import { Config } from '../config/Config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class RestApiService {

    constructor(private config: Config, private http: HttpClient) { }

    createProject(project: any): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.PROJECT_ENDPOINT;
        return this.http.post<any>(URL, project);
    }

    getVersionByProjectName(projectName: string, versionName: string): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.VERSION_ENDPOINT + "/" + projectName + "?version=" + versionName;
        return this.http.get(URL);
    }

    saveComment(comment: any): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.COMMENT_ENDPOINT;
        return this.http.post<any>(URL, comment);
    }

    saveReplyComment(replyComment: any): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.COMMENT_ENDPOINT + "/reply";
        return this.http.post<any>(URL, replyComment);
    }

    approveVersion(idVersion: any, status: boolean): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.VERSION_ENDPOINT + "/approve/" + idVersion + "/" + status;
        return this.http.put<any>(URL, null);
    }

    saveNewVersion(newVersion: any): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.VERSION_ENDPOINT;
        return this.http.post<any>(URL, newVersion);
    }

    resolveComment(idComment: any): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.COMMENT_ENDPOINT + "/resolve/" + idComment;
        return this.http.put<any>(URL, null);
    }

}
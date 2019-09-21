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

    getVersionByProjectName(projectName: string): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.VERSION_ENDPOINT + "/" + projectName;
        return this.http.get(URL);
    }

    saveComment(comment: any): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.COMMENT_ENDPOINT;
        return this.http.post<any>(URL, comment);
    }

    approveVersion(idVersion: any, status: boolean): Observable<any> {
        let URL: string = this.config.API_SERVER + this.config.VERSION_ENDPOINT + "/approve/" + idVersion + "/" + status;
        return this.http.put<any>(URL, null);
    }

}
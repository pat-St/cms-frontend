import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendRequestService {
  header: HttpHeaders;
  hostUrl = "http://localhost:8000/"

  constructor(private httpClient: HttpClient) {
    this.header = new HttpHeaders({
      'Accept': 'application/json'
    });
  }

  public getFromBackend(path: string): Observable<any> {
    console.log("request to " + path)
    return this.httpClient.get(this.hostUrl + path, {headers: this.header});
  }
  public getBinaryFromBackend(path: string): Observable<Blob> {
    return this.httpClient.get<Blob>(this.hostUrl + path, {headers: this.header, responseType: 'blob' as 'json'});
  }
}

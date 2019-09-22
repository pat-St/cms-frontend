import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendRequestService {
  header: HttpHeaders;
  hostUrl = "http://192.168.2.9:8001/"; //"http://localhost:8001/"

  constructor(private httpClient: HttpClient) {
    this.header = new HttpHeaders({
      'Accept': 'application/json'
    });
  }

  public getFromBackend(path: string): Observable<any> {
    console.log("request to " + path);
    return this.httpClient.get(this.hostUrl + path, {headers: this.header});
  }
  public getBinaryFromBackend(path: string): Observable<Blob> {
    return this.httpClient.get<Blob>(this.hostUrl + path, {headers: this.header, responseType: 'blob' as 'json'});
  }
}

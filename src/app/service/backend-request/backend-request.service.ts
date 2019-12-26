import { Token } from './../../model/user';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnyARecord } from 'dns';
@Injectable({
  providedIn: 'root'
})
export class BackendRequestService {
  header = new HttpHeaders({'Accept': 'application/json'});
  
  constructor(@Inject('BACKEND_API_URL') private hostUrl: string, private httpClient: HttpClient) {
  }

  getHeader() {
    const checkToken = JSON.parse(localStorage.getItem('token')) as any;
    if (checkToken !== null) {
      const token = checkToken as Token;
      return this.header.append('apikey', token.token);
    }
    return this.header;
  }

  public getFromBackend(path: string): Observable<any> {
    return this.httpClient.get(this.hostUrl + path, {headers: this.getHeader()});
  }

  public updateToBackend(path: string, obj: Array<any>): Observable<any> {
    const putHeader = new HttpRequest('PUT', this.hostUrl + path, obj, {headers: this.getHeader()});
    return this.httpClient.request(putHeader);
  }

  public updateImageToBackend(path: string, obj: any): Observable<any> {
    const putHeader = new HttpRequest('PUT', this.hostUrl + path, obj, {headers: this.getHeader().append('Content-Type', 'image/jpeg')});
    return this.httpClient.request(putHeader);
  }

  public createToBackend(path: string, obj: Array<any>): Observable<any> {
    const postHeader = new HttpRequest('POST', this.hostUrl + path, obj, {headers: this.getHeader()});
    return this.httpClient.request(postHeader);
  }

  public deleteToBackend(path: string, obj: number): Observable<any> {
    return this.httpClient.delete(this.hostUrl + path + '/' + obj, { headers: this.getHeader()});
  }

  public getBinaryFromBackend(path: string): Observable<Blob> {
    return this.httpClient.get<Blob>(this.hostUrl + path, {headers: this.getHeader(), responseType: 'blob' as 'json'});
  }

}

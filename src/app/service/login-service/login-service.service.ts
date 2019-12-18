import { User, Token } from './../../model/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendRequestService } from './../backend-request/backend-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  header: HttpHeaders;
  hostUrl = "http://localhost:8000/user/";

  isLogin = false;

  constructor(private httpClient: HttpClient) {
    this.header = new HttpHeaders({
      'Authorization': 'Basic ',
    });
  }

  login(user: User): Promise<boolean> {
    const userauth = 'Basic ' + window.btoa(user.getUser()[0] + ':' + user.getUser()[1]);
    const newHeader = new HttpHeaders({
      'Authorization': userauth,
    });
    return new Promise((resolve, reject) => {
      this.sendLoginToBackend("login", newHeader).subscribe(
        (result: any) => {
          if (result as Token) {
            localStorage.setItem('token', JSON.stringify(result));
            localStorage.setItem('username', JSON.stringify(user.getUser()[0]));
            return resolve(true);
          } else {
            console.log("login error " + JSON.stringify(result));
            return resolve(false);
          }
        },
        (error) => {
          console.log("login error " + JSON.stringify(error));
          return reject(false);
        }
      );
    });
  }

  logout() {
    const user = JSON.parse(localStorage.getItem('username')) as any as string;
    if (user === null) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.sendLogoutToBackend("logout/"+ user).subscribe(
      (result: boolean) => {
      if (result) {
        return resolve(true);
      }
    },
    (error) => {
      console.log("login error " + JSON.stringify(error));
      return reject(false);
    });
  }).then((res) => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.clear();
  });
  }

  private sendLoginToBackend(path: string, authheader: HttpHeaders): Observable<any> {
    return this.httpClient.get<any>(this.hostUrl + path, {headers: authheader});
  }

  private sendLogoutToBackend(path: string): Observable<boolean> {
    return this.httpClient.get<boolean>(this.hostUrl + path, {headers: this.header});
  }

  // testMock(): Observable<boolean> {
  //   const checkToken = JSON.parse(localStorage.getItem('token')) as any;
  //   if (checkToken !== null) {
  //     const token = checkToken as Token;
  //     const newHeader = new HttpHeaders({
  //       'apikey': token.token,
  //     });
  //     return this.httpClient.get<boolean>(this.hostUrl + "mock", {headers: newHeader});
  //   } else {
  //     return null;
  //   }
  // }

}

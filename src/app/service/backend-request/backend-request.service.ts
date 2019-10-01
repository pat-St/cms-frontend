import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendRequestService {
  header: HttpHeaders;
  hostUrl = "http://192.168.2.9:8001/"; //"http://localhost:8001/"

  imageCache: Map<number, string> = new Map();

  constructor(private httpClient: HttpClient) {
    this.header = new HttpHeaders({
      'Accept': 'application/json'
    });
  }

  public getFromBackend(path: string): Observable<any> {
    console.log("request to " + path);
    return this.httpClient.get(this.hostUrl + path, {headers: this.header});
  }
  private getBinaryFromBackend(path: string): Observable<Blob> {
    return this.httpClient.get<Blob>(this.hostUrl + path, {headers: this.header, responseType: 'blob' as 'json'});
  }

  public fetchImageFromCache(desc: number) {
    return new Promise((resolve, reject) => {
      if (!this.imageCache.has(desc)) {
        setTimeout(() => {
          resolve(null);
        }, 1000)
      } else {
        resolve(this.imageCache.get(desc))
      }
    });
  }

  public async loadImage(desc: string, id: number) {
    this.getBinaryFromBackend("image/desc/" + desc).subscribe(
      (val) => {
        this.createImageFromBlob(id, val);
      },
      response => {
        console.log("Image Error", response);
      },
      () => {   }
    );
  }

  private async createImageFromBlob(idOfImage: number, image: Blob) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageCache.set(idOfImage, reader.result.toString());
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  showImage(desc: number): string {
    if (this.imageCache.has(desc)) {
      return this.imageCache.get(desc);
    }
    return "";
  }
}

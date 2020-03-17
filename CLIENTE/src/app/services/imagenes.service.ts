import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  url = environment.url + 'guardarArchivo';
  httpHeaders = new HttpHeaders({'Content-Type': 'multipart/form-data'});

  constructor(private http: HttpClient) {

  }

  guardarArchivo(formData) {
    return this.http.post(this.url, formData);
  }

}

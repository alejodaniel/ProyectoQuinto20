import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Archivo} from '../Models/Archivo';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  url = environment.url;
  httpHeaders = new HttpHeaders({'Content-Type': 'multipart/form-data'});

  constructor(private http: HttpClient) {

  }

  guardarArchivo(formData) {
    return this.http.post(this.url, formData);
  }

  guardarArchivoUsuarios(archivo) {
    return this.http.post(environment.url + 'archivo', archivo);
  }

  getArchivoUsuarios() {
    return this.http.get(environment.url + 'getArchivos');
  }

  getOneArchivo(archivoId) {
    return this.http.get(environment.url + 'archivo/' + archivoId);
  }

  createUser(usuario) {
    return this.http.post(this.url + 'asistente', usuario);
  }

  actualizarPersona(usuario) {
    return this.http.put(this.url + 'asistente', usuario);
  }

  findUserByName(nombre) {
    return this.http.get(this.url + 'asistentes/' + nombre);
  }

  findByDate(fecha) {
    return this.http.get(this.url + 'asistentes/fecha/' + fecha);
  }

  deleteFile(id) {
    return this.http.delete(this.url + 'file/' + id);
  }

}

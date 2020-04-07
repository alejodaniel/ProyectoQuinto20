import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UiService} from './ui.service';

@Injectable({
    providedIn: 'root'
})
export class TimbrarService {

    token: string;
    url = environment.url;

    constructor(private storage: Storage, private http: HttpClient, private uiServices: UiService) {

    }

    async obtenerToken() {
        this.token = await this.storage.get('token');
    }

    async crearTimbrada(timbrar) {
        await this.obtenerToken();
        const headers = new HttpHeaders({'token': this.token});
        return new Promise(resolve => {
            this.http.post(this.url + 'user/create/timbrar', timbrar, {headers}).subscribe(res => {
                resolve(res);
            }, err => {
                alert(JSON.stringify(err));
            });
        });
    }

    async actualizar(timbrar) {
        await this.obtenerToken();
        const headers = new HttpHeaders({'token': this.token});
        return new Promise(resolve => {
            this.http.post(this.url + 'user/update/timbrar', timbrar, {headers}).subscribe(res => {

                resolve(res);
            }, err => {
                alert(JSON.stringify(err));
            });
        });
    }

    async obtener(fecha) {
        await this.obtenerToken();
        fecha = fecha.replace('/', '-');
        fecha = fecha.replace('/', '-');
        const headers = new HttpHeaders({'token': this.token});
        return new Promise(resolve => {
            this.http.get(this.url + 'user/obtener/timbrar/' + fecha, {headers}).subscribe(res => {
                resolve(res);
            }, err => {
                alert(JSON.stringify(err));
            });
        });
    }

}

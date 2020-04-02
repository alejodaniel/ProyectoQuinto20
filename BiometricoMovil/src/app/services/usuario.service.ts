import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {Usuario} from '../models/usuario';
import {environment} from '../../environments/environment';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    token: string;
    private usuario: Usuario = {};
    _themeDark;
    url = environment.url;

    constructor(private http: HttpClient, private storage: Storage, private nav: NavController) {
    }


    getUsuario() {
        if (!this.usuario._id) {
            this.validaToken();
        }
        return {...this.usuario};
    }

    async guardarToken(token: string) {
        this.token = token;
        this.storage.set('token', token);
    }

    async cargarToken() {
        this.token = await this.storage.get('token') || null;
    }

    async validaToken(): Promise<boolean> {
        await this.cargarToken();

        if (!this.token) {
            this.nav.navigateRoot('/login');
            return Promise.resolve(false);
        }

        return new Promise(resolve => {
            const headers = new HttpHeaders({
                'token': this.token
            });
            this.http.get(this.url + 'user/', {headers}).subscribe(res => {
                if (res['ok']) {
                    this.usuario = res['usuario'];
                    this._themeDark = this.usuario.tema;
                    resolve(true);
                } else {
                    this.nav.navigateRoot('/login');
                    console.log(res);
                    resolve(false);
                }
            });
        });
    }

    registrarUsuario(usuario: Usuario) {
        return new Promise(resolve => {
            this.http.post(this.url + 'user/create', usuario).subscribe(res => {
                alert(JSON.stringify(res));
                if (res['ok']) {
                    this.guardarToken(res['token']);
                    resolve(true);
                } else {
                    this.token = null;
                    this.storage.clear();
                    resolve(res);
                }
            }, err => {
                alert(JSON.stringify(err));
            });
        });
    }

    public get themeDark(): boolean {
        return this._themeDark;
    }

    changeTheme(value): void {
        this._themeDark = value;
        if (value == true) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }
}

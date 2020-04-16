import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {Usuario} from '../models/usuario';
import {environment} from '../../environments/environment';
import {Storage} from '@ionic/storage';
import {UiService} from './ui.service';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    token: string;
    private usuario: Usuario = {};
    _themeDark;
    url = environment.url;

    constructor(private transfer: FileTransfer, private http: HttpClient, private storage: Storage, private nav: NavController, private uiServices: UiService) {
    }


    async getUsuario() {
        if (!this.usuario._id) {
            await this.validaToken();
        }

        return this.usuario;
    }

    async guardarToken(token: string) {
        this.token = token;
        this.storage.set('token', token);
    }

    async cargarToken() {
        this.token = await this.storage.get('token') || null;
    }

    obtenerToken() {
        return this.token;
    }

    async validaToken(): Promise<boolean> {
        await this.cargarToken();
        if (!this.token) {
            this.nav.navigateRoot('/registro');
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
                    this.nav.navigateRoot(['/']);
                    resolve(true);
                } else {
                    this.nav.navigateRoot('/registro');
                    resolve(false);
                }
            }, error => {
                this.uiServices.presentToast('Algo ha salido mal');
            });
        });
    }

    registrarUsuario(usuario: Usuario) {
        return new Promise(resolve => {
            this.http.post(this.url + 'user/create', usuario).subscribe(res => {
                if (res['ok']) {
                    this.guardarToken(res['token']);
                    resolve(res);
                } else {
                    this.token = null;
                    this.storage.clear();
                    resolve(res);
                }
            }, err => {
                this.uiServices.presentToast('Algo ha salido mal');
            });
        });
    }

    public get themeDark(): boolean {
        return this._themeDark;
    }

    async actualizarUsuario(usuario: Usuario) {
        await this.cargarToken();
        const headers = new HttpHeaders({'token': this.token});
        return new Promise(resolve => {
            this.http.post(this.url + 'user/update', usuario, {headers}).subscribe(res => {
                if (res['ok']) {
                    this.guardarToken(res['token']);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, err => {
                this.uiServices.presentToast('Algo ha salido mal');
            });
        });
    }

    changeTheme(value): void {
        this._themeDark = value;
        if (value == true) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

    // @ts-ignore
    async buscarUsuarioPorToken() {
        this.token = await this.storage.get('token');
        const headers = new HttpHeaders({
            'token': this.token
        });
        return new Promise(resolve => {
            this.http.get(this.url + 'user/', {headers}).subscribe(res => {
                if (res['ok']) {
                    this.usuario = res['usuario'];
                    this._themeDark = this.usuario.tema;
                    resolve(res);
                }
            }, err => {
                this.nav.navigateRoot('/registro');
            });
        });
    }

    login(email: string, password: string) {
        const data = {email, password};
        return new Promise(resolve => {
            this.http.post(this.url + 'user/login', data).subscribe(res => {
                if (res['ok']) {
                    this.guardarToken(res['token']);
                    resolve(true);
                } else {
                    this.token = null;
                    this.storage.clear();
                    resolve(false);
                }
            });
        });

    }

    async subirImagen(img: string) {
        await this.cargarToken();
        const options: FileUploadOptions = {
            fileKey: 'image',
            headers: {
                'token': this.token
            }
        };
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.upload(img, this.url + 'user/imagen', options).then(data => {
            JSON.parse(data['response']);
            this.usuario.avatar = JSON.parse(data['response']).img;
            this.actualizarUsuario(this.usuario);
        }).catch(err => {
            console.log(err);
        });
    }


}

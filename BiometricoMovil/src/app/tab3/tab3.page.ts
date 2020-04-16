import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Storage} from '@ionic/storage';
import {NavController} from '@ionic/angular';
import {TimbrarService} from '../services/timbrar.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    usuario: Usuario = {};
    darkMode = this.userService.themeDark;
    fecha = null;

    constructor(private userService: UsuarioService, private storage: Storage, private nav: NavController, private timbrarServices: TimbrarService) {
        this.cargarUsuario();
    }


    async cargarUsuario() {
        this.usuario = await this.userService.getUsuario();
    }

    changeTheme() {
        this.userService.changeTheme(this.darkMode);
        this.usuario.tema = this.darkMode;
        const retorno = this.userService.actualizarUsuario(this.usuario);
    }


    logout() {
        this.storage.clear();
        this.nav.navigateRoot('/registro', {animated: true});
    }

    reporte() {
        const dia = this.fecha.substr(8, 2);
        const mes = this.fecha.substr(5, 2);
        const anio = this.fecha.substr(0, 4);
        this.fecha = dia + '-' + mes + '-' + anio;
        this.timbrarServices.generarReporte(this.fecha).then(res => {
            if (res['ok']) {
                console.log(res);
            }
        });
    }
}

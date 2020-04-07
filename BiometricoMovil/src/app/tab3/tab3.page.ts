import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Storage} from '@ionic/storage';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    usuario: Usuario = {};
    darkMode = this.userService.themeDark;

    constructor(private userService: UsuarioService, private storage: Storage, private nav: NavController) {

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
}

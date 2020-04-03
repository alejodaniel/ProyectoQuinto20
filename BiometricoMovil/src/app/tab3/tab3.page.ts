import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    usuario: Usuario = {};
    darkMode = this.userService.themeDark;

    constructor(private userService: UsuarioService) {

    }


    changeTheme() {
        this.userService.changeTheme(this.darkMode);
        this.usuario.tema = this.darkMode;
        const retorno = this.userService.actualizarUsuario(this.usuario);
    }

}

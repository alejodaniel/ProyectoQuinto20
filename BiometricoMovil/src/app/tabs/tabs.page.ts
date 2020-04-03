import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    darkMode;
    usuario: Usuario = {};

    constructor(private userService: UsuarioService) {
        this.changeTheme();
    }

    async changeTheme() {
        await this.userService.buscarUsuarioPorToken().then(res => {
            this.usuario = res['usuario'];
        });
        this.darkMode = this.usuario.tema;
        if (this.darkMode == true) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

}

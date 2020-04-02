import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    darkMode = this.userService.themeDark;

    constructor(private userService: UsuarioService) {
        this.changeTheme();
    }

    changeTheme(): void {
        if (this.darkMode == true) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

}

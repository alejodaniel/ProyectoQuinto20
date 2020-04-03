import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {UsuarioService} from './services/usuario.service';
import {Usuario} from './models/usuario';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    darkMode;
    usuario: Usuario = {};

    constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private userService: UsuarioService) {
        this.initializeApp();
        this.changeTheme();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
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

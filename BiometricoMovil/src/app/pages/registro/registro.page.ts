import {Component, OnInit, ViewChild} from '@angular/core';
import {Platform} from '@ionic/angular';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {Usuario} from '../../models/usuario';
import {NgForm} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {UiService} from '../../services/ui.service';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.page.html',
    styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

    validacion: any = {};
    usuario: Usuario = {};

    constructor(private fingerprint: FingerprintAIO, private userService: UsuarioService, private uiService: UiService) {

    }


    ngOnInit() {

    }

    showFingerPrint() {
        this.fingerprint.show({
            title: 'Escaner de Huella',
            disableBackup: true,
        }).then(res => {
            const caracteres = 'abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789';
            let dato = '';
            for (let i = 0; i < 20; i++) {
                dato += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            this.usuario.huella = dato;
        });
    }

    registrarUsuario(regPerson: NgForm) {
        alert('hola');
        this.userService.registrarUsuario(this.usuario).then(res => {
            alert(JSON.stringify(res));
            if (!res['ok']) {
                this.validacion = res['err']['errors'];
            }
        });
    }

}

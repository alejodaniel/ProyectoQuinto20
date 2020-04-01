import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {Usuario} from '../../models/usuario';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.page.html',
    styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {


    usuario: Usuario = {};

    constructor(private platform: Platform, private fingerprint: FingerprintAIO) {

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
            alert(this.usuario.huella);
        }).catch(err => {
            alert(err);
        });
    }

}

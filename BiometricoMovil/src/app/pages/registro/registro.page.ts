import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides, NavController, Platform} from '@ionic/angular';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {Usuario} from '../../models/usuario';
import {NgForm} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {UiService} from '../../services/ui.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {File} from '@ionic-native/file/ngx';
import {HttpClient} from '@angular/common/http';
import * as papa from 'papaparse';

// import {FileOpener} from '@ionic-native/file-opener/ngx';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-registro',
    templateUrl: './registro.page.html',
    styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

    csvData = [];
    headerRow = [];
    validacion: any = {};
    usuario: Usuario = {};
    loginUSer: Usuario = {};
    location: any
    pdf = 'pdf';
    pdfObject: any;
    passwordRep: string;
    @ViewChild('slidePrincipal', {static: true}) slides: IonSlides;

    constructor(private fingerprint: FingerprintAIO, private userService: UsuarioService, private uiService: UiService,
                private navController: NavController,
    ) {
       // this.csvDato();
    }

    ngOnInit() {
        this.slides.slideTo(1);
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

    async registrarUsuario(regPerson: NgForm) {

        if (regPerson.invalid) {
            this.uiService.alertaInformativa('Hay campos invalidos');
            return regPerson.form;
        }
        if (this.usuario.password == this.passwordRep) {
            this.usuario.tema = false;
            this.usuario.rol = 'usuario';
            this.userService.registrarUsuario(this.usuario).then(res => {
                if (!res['ok']) {
                    this.validacion = res['err']['errors'];
                }
                if (res['ok']) {
                    this.navController.navigateRoot(['/'], {animated: true});
                }
            });
        } else {
            this.uiService.presentToast('Las contraseñas no coinciden');
        }
    }

    mostrarLogin() {
        this.slides.slideTo(1);

    }

    mostrarRegistro() {
        this.slides.slideTo(0);
    }

    async login(flogin: NgForm) {
        if (flogin.invalid) {
            return;
        }
        const valido = await this.userService.login(this.loginUSer.email, this.loginUSer.password);
        // @ts-ignore
        if (valido) {
            this.navController.navigateRoot('/', {animated: true});
        } else {
            this.uiService.alertaInformativa('Usuario o contraseña no son correctos');
        }
    }
}

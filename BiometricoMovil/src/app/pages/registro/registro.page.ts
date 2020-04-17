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

import {FileOpener} from '@ionic-native/file-opener/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
                private file: File,
                private fileOpener: FileOpener,
                private platform: Platform,
                private http: HttpClient
    ) {
        this.csvDato();
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

    generarPdf() {
        // playground requires you to assign document definition to a variable called dd

        const genPdf = {
            content: [
                {text: 'INSTITUTO TECNOLÓGICO SUPERIOR "YAVIRAC"', style: 'header'},
                'Informes semanales de asistencias del instituto.',
                {text: 'Semana 1', style: 'subheader'},
                {
                    style: 'tableExample',
                    table: {
                        body: [
                            [

                                {
                                    fillColor: '#F4FA58',
                                    text: 'NOMBRE'
                                },
                                {
                                    fillColor: '#F4FA58',
                                    text: 'APELLIDO'
                                },
                                {
                                    fillColor: '#F4FA58',
                                    text: 'ENTRADA'
                                },
                                {
                                    fillColor: '#F4FA58',
                                    text: 'ALMUERZO'
                                },
                                {
                                    fillColor: '#F4FA58',
                                    text: 'REGRESADA ALMUERZO'
                                },
                                {
                                    fillColor: '#F4FA58',
                                    text: 'SALIDA'
                                },
                            ],
                            [

                                {
                                    fillColor: '#FBFBEF',
                                    text: 'ALEJO'
                                },
                                {
                                    fillColor: '#FBFBEF',
                                    text: 'CORONEL'
                                },
                                {
                                    fillColor: '#FBFBEF',
                                    text: '8:00'
                                },
                                {
                                    fillColor: '#FBFBEF',
                                    text: '12:00'
                                }, {
                                fillColor: '#FBFBEF',
                                text: '13:00'
                            },
                                {
                                    fillColor: '#FBFBEF',
                                    text: '17:00'
                                },


                            ]
                        ]
                    }
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }

        };
        this.pdfObject = pdfMake.createPdf(genPdf);

        alert('pdfGenerado');

    }

    openPdf() {
        if (this.platform.is('cordova')) {
            this.pdfObject.getBuffer((buffer) => {
                const blob = new Blob([buffer], {type: 'application/pdf'});
                // Se genera el pdf desde el celu
                this.file.writeFile(this.file.dataDirectory, 'reporte.pdf', blob, {replace: true}).then(
                    fileEntry => {
                        this.fileOpener.open(this.file.dataDirectory + 'reporte.pdf', 'application/pdf');
                    });
            });
            return true;
        }
        this.pdfObject.download();
    }

    csvDato() {
        this.http.get('assets/data.csv').subscribe(
            data => this.extraerData(data),
            err => this.handleError(err)
        );
    }

    extraerData(res) {
        const csvData = res['body'] || '';
        const parseData = papa.parse(csvData).data;
        this.headerRow = parseData[0];
        parseData.splice(0, 1);
        this.csvData = parseData;
    }

    downloadCSV() {
        const csv = papa.unparse({
            fields: this.headerRow,
            data: this.csvData
        });
        const blob = new Blob([csv]);
        const a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "informe.csv";
        document.body.appendChild(a);
        a.click();
        console.log(a);
        document.body.removeChild(a);
    }

    trackByFn(index: any, item: any) {
        return index;
    }

    handleError(err) {

    }
}

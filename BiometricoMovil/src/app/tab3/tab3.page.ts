import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Storage} from '@ionic/storage';
import {ActionSheetController, NavController, Platform} from '@ionic/angular';
import {TimbrarService} from '../services/timbrar.service';
import {HttpClient} from '@angular/common/http';
import * as papa from 'papaparse';
import {json} from '@angular-devkit/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    csvData = [];
    headerRow = [];
    pdfObject: any;
    usuario: Usuario = {};
    darkMode = this.userService.themeDark;
    fecha = null;
    fechaFin = null;
    dataReporte: any = [];

    constructor(private userService: UsuarioService, private storage: Storage, private nav: NavController, private timbrarServices: TimbrarService,
                private file: File, private fileOpener: FileOpener, private social: SocialSharing, private platform: Platform, private actionSheetController: ActionSheetController) {
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

    async reporte() {

        if (this.fecha.length > 10) {
            const dia = this.fecha.substr(8, 2);
            let mes = this.fecha.substr(5, 2);
            const anio = this.fecha.substr(0, 4);
            if (mes.substr(0, 1) == 0) {
                mes = this.fecha.substr(6, 1);
            }
            this.fecha = dia + '-' + mes + '-' + anio;

        }

        if (this.fechaFin.length > 10) {
            const dia = this.fechaFin.substr(8, 2);
            let mes = this.fechaFin.substr(5, 2);
            const anio = this.fechaFin.substr(0, 4);
            if (mes.substr(0, 1) == 0) {
                mes = this.fechaFin.substr(6, 1);
            }
            this.fechaFin = dia + '-' + mes + '-' + anio;

        }
        await this.timbrarServices.generarReporte(this.fecha, this.fechaFin).subscribe(res => {
            if (res['ok']) {
                this.dataReporte = res['timbrar'];
                for (let i = 0; i < this.dataReporte.length; i++) {
                    this.userService.obtenerUsuarioPorId(this.dataReporte[i].usuario).subscribe(usuario => {
                        this.dataReporte[i].usuario = usuario['usuario'].nombre + ' ' + usuario['usuario'].apellido;
                    });
                }
            }
        });
    }

    async ordenarDatos() {
        this.dataReporte.sort(function (a, b) {
            if (a.usuario > b.usuario) {
                return 1;
            }
            if (a.usuario < b.usuario) {
                return -1;
            }
            return 0;
        });

        const csv = papa.unparse(this.dataReporte);
        this.downloadCSV(csv);
    }

    downloadCSV(csv) {
        if (this.platform.is('cordova')) {
            console.log('csv: ', csv);
            this.file.writeFile(this.file.dataDirectory, 'informe.csv', csv, {replace: true}).then(res => {
                this.social.share(null, null, res.nativeURL, null);
            });
        } else {
            const blob = new Blob([csv]);
            const a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'informe.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    trackByFn(index: any, item: any) {
        return index;
    }

    handleError(err) {

    }


    activar() {
        if (this.fechaFin == null || this.fecha == null) {
            return true;
        }
        return false;
    }

    generarPdf() {
        this.dataReporte.sort(function (a, b) {
            if (a.usuario > b.usuario) {
                return 1;
            }
            if (a.usuario < b.usuario) {
                return -1;
            }
            return 0;
        });
        const data = [];
        data.push(['Nombre', 'Entrada', 'Almuerzo', 'Regreso', 'Salida']);
        for (let i = 0; i < this.dataReporte.length; i++) {
            data.push([this.dataReporte[i].usuario, this.dataReporte[i].entrada, this.dataReporte[i].almuerzo, this.dataReporte[i].regreso, this.dataReporte[i].salida]);
        }

        const genPdf = {
            content: [
                {text: 'INSTITUTO TECNOLÓGICO SUPERIOR "YAVIRAC"', style: 'header'},
                'Informes semanales de asistencias del instituto.',
                {text: 'Semana 1', style: 'subheader'},
                {
                    style: 'tableExample',
                    table: {
                        body: data
                    }
                },
            ],
            styles:
                {
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
                        margin: [0, 5, 0, 15],
                        color: 'black',
                        bold: true,
                        fontSize: 13,
                        cssClass: 'Table'
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
        this.openPdf();
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


    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Seleccione foto',
            buttons: [{
                text: 'Generar PDF',
                icon: 'document-outline',
                handler: () => {
                    this.generarPdf();
                }
            }, {
                text: 'Generar CSV',
                icon: 'clipboard-outline',
                handler: () => {
                    this.ordenarDatos();
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }


}

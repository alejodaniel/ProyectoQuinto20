import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Storage} from '@ionic/storage';
import {NavController, Platform} from '@ionic/angular';
import {TimbrarService} from '../services/timbrar.service';
import {HttpClient} from '@angular/common/http';
import * as papa from 'papaparse';
import {json} from "@angular-devkit/core";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';

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

    constructor(private userService: UsuarioService, private storage: Storage, private nav: NavController,
                private timbrarServices: TimbrarService,
                private file: File,
                private fileOpener: FileOpener,
                private platform: Platform) {
        this.cargarUsuario();
        console.log(this.usuario);
    }


    async cargarUsuario() {
        this.usuario = await this.userService.getUsuario();
        console.log(this.usuario);
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
                        this.dataReporte[i].usuario = usuario['usuario'];
                    });
                }
            }
        });
    }

    async ordenarDatos() {
        this.dataReporte.sort(function (a, b) {
            if (a.usuario.nombre > b.usuario.nombre) {
                return 1;
            }
            if (a.usuario.nombre < b.usuario.nombre) {
                return -1;
            }
            return 0;
        });

    }

    activar() {
        if (this.fechaFin == null || this.fecha == null) {
            return true;
        }
        return false;
    }

    generarPdf() {

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
                                    text: `${this.usuario.nombre}`
                                },
                                {
                                    fillColor: '#FBFBEF',
                                    text: `${this.usuario.apellido}`
                                },
                                {
                                    fillColor: '#FBFBEF',
                                    text: `${this.usuario.carrera}`
                                },
                                {
                                    fillColor: '#FBFBEF',
                                    text: `${this.usuario.avatar}`
                                }, {
                                fillColor: '#FBFBEF',
                                text: `${this.usuario.nombre}`
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
        this.pdfObject.download();
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

}

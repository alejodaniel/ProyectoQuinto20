import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {environment} from '../../environments/environment';
import {TimbrarService} from '../services/timbrar.service';
import {Timbrar} from "../models/timbrar";

declare var window: any;

// @ts-ignore
declare var mapboxgl: any;

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    usuario: Usuario = {};
    timbradas: any[] = [];
    fecha = null;
    fechaFin = null;
    habilitado = true;
    img: any = '';
    url = environment.url;
    mostrarTabla = false;

    // @ts-ignore
    @ViewChild('mapa') mapa;

    constructor(private camera: Camera, private usuarioService: UsuarioService, private geolocation: Geolocation,
                private alert: AlertController, private actionSheetController: ActionSheetController, private timbrarService: TimbrarService) {
        this.cargarUsuario();
        this.obtenerImagen();
    }

    ngOnInit() {

    }

    async cargarUsuario() {
        this.usuario = await this.usuarioService.getUsuario();
    }


    camara() {

        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.CAMERA
        };

        this.procesarImagen(options);
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Seleccione foto',
            buttons: [{
                text: 'Tomar Foto',
                icon: 'camera',
                handler: () => {
                    this.camara();
                }
            }, {
                text: 'Elegir de Galeria',
                icon: 'images',
                handler: () => {
                    this.carrete();
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


    carrete() {

        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };

        this.procesarImagen(options);

    }

    procesarImagen(options: CameraOptions) {

        this.camera.getPicture(options).then((imageData) => {
            this.usuarioService.subirImagen(imageData);
            this.img = window.Ionic.WebView.convertFileSrc(imageData);
        }, (err) => {
            // Handle error
        });
    }

    async obtenerImagen() {
        await this.cargarUsuario();
        this.img = this.url + 'user/imagen/' + this.usuario._id + '/' + this.usuario.avatar;
    }

    async cargarTimbradas() {
        this.timbrarService.obtenerTimbradas().then(res => {
            if (res['ok']) {
                this.mostrarTabla = true;
                this.timbradas = res['timbrar'];
            }

        }).catch(err => {
        });
    }

    activar() {
        if (this.fechaFin == null || this.fecha == null) {
            return true;
        }
        return false;
    }

    async reporte(data) {
        const dia1 = data.fecha1.substr(8, 2);
        let mes1 = data.fecha1.substr(5, 2);
        const anio1 = data.fecha1.substr(0, 4);

        data.fecha1 = dia1 + '-' + mes1 + '-' + anio1;

        const dia = data.fecha2.substr(8, 2);
        let mes = data.fecha2.substr(5, 2);
        const anio = data.fecha2.substr(0, 4);

        data.fecha2 = dia + '-' + mes + '-' + anio;


        await this.timbrarService.generarReporte(data.fecha1, data.fecha2).subscribe(res => {
            if (res['ok']) {
                this.timbradas = res['timbrar'];
                this.mostrarTabla = true;
            }
        });
    }

    async escribirFecha() {
        const alert = await this.alert.create({
            inputs: [
                {
                    name: 'fecha1',
                    placeholder: 'fecha Inicial',
                    type: 'date'
                },
                {
                    name: 'fecha2',
                    placeholder: 'fecha Secundaria',
                    type: 'date'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Buscar',
                    handler: data => {
                        this.reporte(data);
                    }
                },
            ]
        });
        await alert.present();
    }
}



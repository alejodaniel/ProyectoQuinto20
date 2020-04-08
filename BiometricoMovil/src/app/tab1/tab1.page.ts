import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {environment} from '../../environments/environment';
import {TimbrarService} from '../services/timbrar.service';

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
    img: any = '';
    url = environment.url;
    mostrarTabla = false;

    // @ts-ignore
    @ViewChild('mapa') mapa;

    constructor(private camera: Camera, private usuarioService: UsuarioService, private geolocation: Geolocation,
                private actionSheetController: ActionSheetController, private timbrarService: TimbrarService) {
        this.cargarUsuario();
        this.obtenerImagen();
    }

    ngOnInit() {

    }

    async cargarUsuario() {
        const validado = await this.usuarioService.validaToken();
        if (validado) {
            const result = await this.usuarioService.buscarUsuarioPorToken();
            this.usuario = result['usuario'];
        }
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

}



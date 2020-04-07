import {Component, ViewChild} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {environment} from '../../environments/environment';

declare var window: any;

// @ts-ignore
declare var mapboxgl: any;

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    usuario: Usuario = {};
    img: any = '';
    url = environment.url;

    // @ts-ignore
    @ViewChild('mapa') mapa;

    constructor(private camera: Camera, private usuarioService: UsuarioService, private geolocation: Geolocation,
                private actionSheetController: ActionSheetController) {
        this.cargarUsuario();
        this.dibujarMapa();
        this.obtenerImagen();
    }

    async cargarUsuario() {
        const validado = await this.usuarioService.validaToken();
        if (validado) {
            const result = await this.usuarioService.buscarUsuarioPorToken();
            this.usuario = result['usuario'];
        }
    }

    dibujarMapa() {
        this.geolocation.getCurrentPosition().then((data) => {
            // resp.coords.latitude
            // resp.coords.longitude
            mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2tlcnJhZXoiLCJhIjoiY2s4a3BvNWp5MDRlMDNlcGhsbXViZjYwMCJ9.XHOX6C8xw-bqbov8ZYur6A';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [data.coords.longitude, data.coords.latitude],
                zoom: 16
            });
            const marker = new mapboxgl.Marker().setLngLat([data.coords.longitude, data.coords.latitude])
                .addTo(map);

            map.addControl(new mapboxgl.NavigationControl());
        }).catch((error) => {
            console.log('Error getting location', error);
        });
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

}



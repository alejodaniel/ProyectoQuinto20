import {Component, OnInit, ViewChild} from '@angular/core';
import {TimbrarService} from '../services/timbrar.service';
import {Timbrar} from '../models/timbrar';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {Storage} from '@ionic/storage';

import {UsuarioService} from '../services/usuario.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {UiService} from '../services/ui.service';
import {ModalController} from '@ionic/angular';
import {UbicacionPage} from '../pages/ubicacion/ubicacion.page';


declare var mapboxgl: any;

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    coordenadas: any;
    // @ts-ignore

    timbrar: Timbrar = new Timbrar();
    isTimbrado: any = {};
    mostrarMapa = false;

    constructor(private  uiService: UiService, private geolocation: Geolocation, private timbrarService: TimbrarService,
                private fingerprint: FingerprintAIO, private storage: Storage, public modalController: ModalController) {
        this.dibujarMapa();
    }

    async ngOnInit() {
        this.timbrar.fecha = new Date().toLocaleDateString();
        this.timbrarService.obtener(this.timbrar.fecha).then(res => {
            if (res['ok']) {
                this.timbrar = res['timbrar'];
                this.storage.set('timbrar', this.timbrar);
                this.isTimbre();
            } else {
                this.crear();
            }

        }).catch(err => {
        });

    }


    crear() {
        this.timbrar.fecha = new Date().toLocaleDateString();
        this.timbrarService.crearTimbrada(this.timbrar).then(res => {
            this.timbrar = res['timbrar'];
            this.storage.set('timbrar', this.timbrar);
        }).catch(err => {

        });
    }

    dibujarMapa() {
        this.geolocation.getCurrentPosition().then((data) => {
            this.coordenadas = `${data.coords.longitude},${data.coords.latitude}`;
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    showFingerPrint(dato) {
        const fecha = new Date();
        this.fingerprint.show({
            title: 'Escaner de Huella',
            disableBackup: true,
        }).then(res => {
            if (dato == 'entrada') {
                this.timbrar.entrada = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.entrada = true;
                this.timbrar.coordEntrada = this.coordenadas;
            }
            if (dato == 'almuerzo') {
                this.timbrar.almuerzo = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.almuerzo = true;
                this.timbrar.coordAlmuerzo = this.coordenadas;
            }
            if (dato == 'regreso') {
                this.timbrar.regreso = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.regreso = true;
                this.timbrar.coordRegreso = this.coordenadas;
            }
            if (dato == 'salida') {
                this.timbrar.salida = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.salida = true;
                this.timbrar.coordSalida = this.coordenadas;
            }
            this.timbrarService.actualizar(this.timbrar).then(result => {

            }).catch(err => {
                this.uiService.presentToast('Ha ocurrido un error al timbrar');
            });
        });
    }

    isTimbre() {
        if (this.timbrar.entrada != '00:00') {
            this.isTimbrado.entrada = true;
        }
        if (this.timbrar.almuerzo != '00:00') {
            this.isTimbrado.almuerzo = true;
        }
        if (this.timbrar.regreso != '00:00') {
            this.isTimbrado.regreso = true;
        }
        if (this.timbrar.salida != '00:00') {
            this.isTimbrado.salida = true;
        }
    }

    mostrarMas(timbrar) {
        this.mostrarMapa = true;
        this.geolocation.getCurrentPosition().then((data) => {
            // resp.coords.latitude
            // resp.coords.longitude
            mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2tlcnJhZXoiLCJhIjoiY2s4a3BvNWp5MDRlMDNlcGhsbXViZjYwMCJ9.XHOX6C8xw-bqbov8ZYur6A';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [data.coords.longitude, data.coords.latitude],
                zoom: 22
            });

            if (timbrar.coordEntrada != null) {
                const latLng = timbrar.coordEntrada.split(',');
                const lat = Number(latLng[1]);
                const lng = Number(latLng[0]);
                new mapboxgl.Marker({color: 'green'}).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup({offset: 25}) // add popups
                    .setHTML('<span> Entrada</span>'))
                    .addTo(map);

            }

            if (timbrar.coordAlmuerzo != null) {
                const latLng = timbrar.coordAlmuerzo.split(',');
                const lat = Number(latLng[1]);
                const lng = Number(latLng[0]);
                new mapboxgl.Marker({color: 'yellow'}).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup({offset: 25}) // add popups
                    .setHTML('<span> Almuerzo</span>'))
                    .addTo(map);

            }

            if (timbrar.coordRegreso != null) {
                const latLng = timbrar.coordRegreso.split(',');
                const lat = Number(latLng[1]);
                const lng = Number(latLng[0]);
                new mapboxgl.Marker().setLngLat([lng, lat]).setPopup(new mapboxgl.Popup({offset: 25}) // add popups
                    .setHTML('<span> Regreso Almuerzo</span>'))
                    .addTo(map);

            }

            if (timbrar.coordSalida != null) {
                const latLng = timbrar.coordSalida.split(',');
                const lat = Number(latLng[1]);
                const lng = Number(latLng[0]);
                new mapboxgl.Marker({color: 'red'}).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup({offset: 25}) // add popups
                    .setHTML('<span> Salida</span>'))
                    .addTo(map);

            }

            map.addControl(new mapboxgl.NavigationControl());
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }
}


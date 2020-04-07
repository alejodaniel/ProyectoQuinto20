import {Component, OnInit, ViewChild} from '@angular/core';
import {TimbrarService} from '../services/timbrar.service';
import {Timbrar} from '../models/timbrar';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {Storage} from '@ionic/storage';

import {UsuarioService} from "../services/usuario.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";


declare var mapboxgl: any;

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    coordenadas: any;
    // @ts-ignore
    @ViewChild('mapa') mapa;

    timbrar: Timbrar = new Timbrar();
    isTimbrado: any = {};

    constructor(private geolocation: Geolocation, private timbrarService: TimbrarService, private fingerprint: FingerprintAIO, private storage: Storage) {
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
            alert(JSON.stringify(err));
        });
    }

    dibujarMapa() {
        this.geolocation.getCurrentPosition().then((data) => {
            // resp.coords.latitude
            // resp.coords.longitude

            const long = data.coords.longitude;
            const lat = data.coords.latitude;
            this.coordenadas = `${data.coords.longitude},${data.coords.latitude}`;
            mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2tlcnJhZXoiLCJhIjoiY2s4a3BvNWp5MDRlMDNlcGhsbXViZjYwMCJ9.XHOX6C8xw-bqbov8ZYur6A';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [long, lat],
                zoom: 16
            });
            const marker = new mapboxgl.Marker().setLngLat([long, lat])
                .addTo(map);
            console.log(this.coordenadas);
            map.addControl(new mapboxgl.NavigationControl());
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    showFingerPrint(dato) {
        console.log(this.coordenadas);
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
                this.timbrar.coordAlmuerzo = this.coordenadas
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


}




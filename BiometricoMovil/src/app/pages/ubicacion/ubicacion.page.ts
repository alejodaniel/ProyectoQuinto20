import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {Geolocation} from '@ionic-native/geolocation/ngx';
import {UsuarioService} from '../../services/usuario.service';
import {Storage} from '@ionic/storage';
import {ModalController, NavParams} from '@ionic/angular';
import {Timbrar} from '../../models/timbrar';

declare var mapboxgl: any;

@Component({
    selector: 'app-ubicacion',
    templateUrl: './ubicacion.page.html',
    styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

    timbrar: Timbrar = new Timbrar();
    corrds: any = [];

    constructor(private usuarioService: UsuarioService, private geolocation: Geolocation, public modalController: ModalController, private navParams: NavParams) {
        this.timbrar = navParams.get('timbrar');

    }

    ngOnInit() {
        this.dibujarMapa();
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            dismissed: true
        });
    }

    dibujarMapa() {
        if (this.timbrar.coordEntrada != null) {
            const coords = this.timbrar.coordEntrada.split(',');

        }
        if (this.timbrar.coordAlmuerzo != null) {
            const coords = this.timbrar.coordAlmuerzo.split(',');
            mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2tlcnJhZXoiLCJhIjoiY2s4a3BvNWp5MDRlMDNlcGhsbXViZjYwMCJ9.XHOX6C8xw-bqbov8ZYur6A';
            const map = new mapboxgl.Map({
                container: 'almuerzo',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [Number(coords[1]), Number(coords[0])],
                zoom: 16
            });

            const marker = new mapboxgl.Marker().setLngLat([Number(coords[1]), Number(coords[0])])
                .addTo(map);
        }
        if (this.timbrar.coordRegreso != null) {
            const coords = this.timbrar.coordRegreso.split(',');
            mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2tlcnJhZXoiLCJhIjoiY2s4a3BvNWp5MDRlMDNlcGhsbXViZjYwMCJ9.XHOX6C8xw-bqbov8ZYur6A';
            const map = new mapboxgl.Map({
                container: 'regreso',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [Number(coords[1]), Number(coords[0])],
                zoom: 16
            });

            const marker = new mapboxgl.Marker().setLngLat(Number(coords[1]), Number(coords[0]))
                .addTo(map);
        }
        if (this.timbrar.coordSalida != null) {
            const coords = this.timbrar.coordSalida.split(',');
            mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2tlcnJhZXoiLCJhIjoiY2s4a3BvNWp5MDRlMDNlcGhsbXViZjYwMCJ9.XHOX6C8xw-bqbov8ZYur6A';
            const map = new mapboxgl.Map({
                container: 'salida',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [Number(coords[1]), Number(coords[0])],
                zoom: 16
            });

            const marker = new mapboxgl.Marker().setLngLat(Number(coords[1]), Number(coords[0]))
                .addTo(map);
        }
    }


}

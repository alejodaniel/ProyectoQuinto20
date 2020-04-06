import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {Geolocation} from '@ionic-native/geolocation/ngx';
import {UsuarioService} from "../../services/usuario.service";

declare var mapboxgl: any;

@Component({
    selector: 'app-ubicacion',
    templateUrl: './ubicacion.page.html',
    styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

    coordenadas: any;
    // @ts-ignore
    @ViewChild('mapa') mapa;

    constructor(private usuarioService: UsuarioService, private geolocation: Geolocation) {
    }

    ngOnInit() {
        console.log(this.localizacion());
    }

    localizacion() {
        this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlam93MzMiLCJhIjoiY2s4ajNmOHpkMDV1MDNscDU0OXkxNGxnZiJ9.VJtEwXz9QZx4G8gw5IzjqQ';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [resp.coords.longitude, resp.coords.latitude],
                zoom: 15
            });
            const marker = new mapboxgl.Marker().setLngLat([resp.coords.longitude, resp.coords.latitude]).addTo(map);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

}

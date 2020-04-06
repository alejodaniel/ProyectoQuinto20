import {Component, ViewChild} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Geolocation} from '@ionic-native/geolocation/ngx';

// @ts-ignore
declare var mapboxgl: any;

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    usuario: Usuario = {};

    // @ts-ignore
    @ViewChild('mapa') mapa;

    constructor(private usuarioService: UsuarioService, private geolocation: Geolocation) {
        this.cargarUsuario();
        this.dibujarMapa();

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
}

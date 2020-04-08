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
  //  @ViewChild('mapa') mapa;

    constructor(private usuarioService: UsuarioService, private geolocation: Geolocation) {
    }

    ngOnInit() {

    }



}

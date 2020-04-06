import {Component, OnInit} from '@angular/core';
import {TimbrarService} from '../services/timbrar.service';
import {Timbrar} from '../models/timbrar';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    timbrar: Timbrar = new Timbrar();
    isTimbrado: any = {};

    constructor(private timbrarService: TimbrarService, private fingerprint: FingerprintAIO) {

    }

    ngOnInit() {
        this.timbrar.fecha = new Date();
        this.timbrarService.crearTimbrada(this.timbrar).then(res => {
            this.timbrar = res['timbrar'];
        }).catch(err => {
            alert(JSON.stringify(err));
        });

    }

    showFingerPrint(dato) {
        this.timbrar.fecha = new Date();
        this.fingerprint.show({
            title: 'Escaner de Huella',
            disableBackup: true,
        }).then(res => {
            if (dato == 'entrada') {
                this.timbrar.entrada = this.timbrar.fecha.getHours() + ':' + this.timbrar.fecha.getMinutes();
                this.isTimbrado.entrada = true;
            }
            if (dato == 'almuerzo') {
                this.timbrar.almuerzo = this.timbrar.fecha.getHours() + ':' + this.timbrar.fecha.getMinutes();
                this.isTimbrado.almuerzo = true;
            }
            if (dato == 'regreso') {
                this.timbrar.regreso = this.timbrar.fecha.getHours() + ':' + this.timbrar.fecha.getMinutes();
                this.isTimbrado.regreso = true;
            }
            if (dato == 'salida') {
                this.timbrar.salida = this.timbrar.fecha.getHours() + ':' + this.timbrar.fecha.getMinutes();
                this.isTimbrado.salida = true;
            }
            this.timbrarService.actualizar(this.timbrar).then(result => {

            }).catch(err => {
            });
        });
    }


}

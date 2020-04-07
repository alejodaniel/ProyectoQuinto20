import {Component, OnInit} from '@angular/core';
import {TimbrarService} from '../services/timbrar.service';
import {Timbrar} from '../models/timbrar';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    timbrar: Timbrar = new Timbrar();
    isTimbrado: any = {};

    constructor(private timbrarService: TimbrarService, private fingerprint: FingerprintAIO, private storage: Storage) {

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

    showFingerPrint(dato) {
        const fecha = new Date();
        this.fingerprint.show({
            title: 'Escaner de Huella',
            disableBackup: true,
        }).then(res => {
            if (dato == 'entrada') {
                this.timbrar.entrada = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.entrada = true;
            }
            if (dato == 'almuerzo') {
                this.timbrar.almuerzo = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.almuerzo = true;
            }
            if (dato == 'regreso') {
                this.timbrar.regreso = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.regreso = true;
            }
            if (dato == 'salida') {
                this.timbrar.salida = fecha.getHours() + ':' + fecha.getMinutes();
                this.isTimbrado.salida = true;
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

    crear() {
        this.timbrar.fecha = new Date().toLocaleDateString();
        this.timbrarService.crearTimbrada(this.timbrar).then(res => {
            this.timbrar = res['timbrar'];
            this.storage.set('timbrar', this.timbrar);
        }).catch(err => {
            alert(JSON.stringify(err));
        });
    }

}




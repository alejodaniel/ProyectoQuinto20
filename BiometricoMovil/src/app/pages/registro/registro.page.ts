import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.page.html',
    styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {


    constructor(private platform: Platform, private fingerprint: FingerprintAIO) {

    }

    ngOnInit() {
    }

    async showFingerPrint() {
        this.fingerprint.show({
            title: 'Escaner de Huella',
            cliendId: 'BioYav',
            clientSecret: 'password',
        }).then(res => {
            alert(res);
        }).catch(err => {
            alert(err);
        });
    }

}

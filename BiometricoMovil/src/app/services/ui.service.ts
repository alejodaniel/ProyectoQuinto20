import {Injectable} from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    constructor(public alertController: AlertController, public toast: ToastController) {

    }

    async alertaInformativa(message: string) {
        const alert = await this.alertController.create({
            message,
            buttons: ['OK', 'CANCEL']
        });

        await alert.present();
    }

    async presentToast(message) {
        const toast = await this.toast.create({
            message,
            position: 'top',
            duration: 1500
        });
        toast.present();
    }

}


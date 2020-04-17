import {Component} from '@angular/core';
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';
import {Storage} from '@ionic/storage';
import {NavController} from '@ionic/angular';
import {TimbrarService} from '../services/timbrar.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    usuario: Usuario = {};
    darkMode = this.userService.themeDark;
    fecha = null;
    fechaFin = null;
    dataReporte: any = [];

    constructor(private userService: UsuarioService, private storage: Storage, private nav: NavController, private timbrarServices: TimbrarService) {
        this.cargarUsuario();
    }


    async cargarUsuario() {
        this.usuario = await this.userService.getUsuario();
    }

    changeTheme() {
        this.userService.changeTheme(this.darkMode);
        this.usuario.tema = this.darkMode;
        const retorno = this.userService.actualizarUsuario(this.usuario);
    }


    logout() {
        this.storage.clear();
        this.nav.navigateRoot('/registro', {animated: true});
    }

    async reporte() {

        if (this.fecha.length > 10) {
            const dia = this.fecha.substr(8, 2);
            let mes = this.fecha.substr(5, 2);
            const anio = this.fecha.substr(0, 4);
            if (mes.substr(0, 1) == 0) {
                mes = this.fecha.substr(6, 1);
            }
            this.fecha = dia + '-' + mes + '-' + anio;

        }

        if (this.fechaFin.length > 10) {
            const dia = this.fechaFin.substr(8, 2);
            let mes = this.fechaFin.substr(5, 2);
            const anio = this.fechaFin.substr(0, 4);
            if (mes.substr(0, 1) == 0) {
                mes = this.fechaFin.substr(6, 1);
            }
            this.fechaFin = dia + '-' + mes + '-' + anio;

        }
        await this.timbrarServices.generarReporte(this.fecha, this.fechaFin).subscribe(res => {
            if (res['ok']) {
                this.dataReporte = res['timbrar'];
                for (let i = 0; i < this.dataReporte.length; i++) {
                    this.userService.obtenerUsuarioPorId(this.dataReporte[i].usuario).subscribe(usuario => {
                        this.dataReporte[i].usuario = usuario['usuario'];
                    });
                }
            }
        });
    }

    async ordenarDatos() {
        this.dataReporte.sort(function(a, b) {
            if (a.usuario.nombre > b.usuario.nombre) {
                return 1;
            }
            if (a.usuario.nombre < b.usuario.nombre) {
                return -1;
            }
            return 0;
        });
        console.log(this.dataReporte);
    }

    activar() {
        if (this.fechaFin == null || this.fecha == null) {
            return true;
        }
        return false;
    }

}

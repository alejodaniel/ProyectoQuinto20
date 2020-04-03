import {Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate} from '@angular/router';
import {Observable} from 'rxjs';
import {UsuarioService} from './usuario.service';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    value: any;

    constructor(private router: NavController, private storage: Storage, private userService: UsuarioService) {
    }

    // @ts-ignore
    canActivate() {
        this.value = this.userService.cargarToken();
        if (this.value != null) {
            return true;
        } else {
            this.router.navigateRoot(['/registro']);
            return false;
        }

    }

}

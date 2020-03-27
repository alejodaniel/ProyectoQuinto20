import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    _themeDark = false;

    constructor() {

    }

    public get themeDark(): boolean {
        this._themeDark = JSON.parse(localStorage.getItem('tema'));
        return this._themeDark;
    }

    changeTheme(value): void {
        if (value == true) {
            document.body.classList.add('dark');
            localStorage.setItem('tema', JSON.stringify(value));
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('tema', JSON.stringify(value));
        }
    }

}

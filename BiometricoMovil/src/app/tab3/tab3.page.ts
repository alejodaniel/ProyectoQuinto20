import {Component} from '@angular/core';
import {ThemeService} from '../services/theme.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    darkMode = this.themeService.themeDark;

    constructor(private themeService: ThemeService) {

    }


    changeTheme() {
        this.themeService.changeTheme(this.darkMode);
        this.darkMode = this.themeService.themeDark;
    }

}

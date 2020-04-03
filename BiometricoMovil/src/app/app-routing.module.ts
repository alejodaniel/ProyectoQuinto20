import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './services/auth.guard';

const routes: Routes = [

    {
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard]
    },
    {
        path: 'registro',
        loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
    },
    {
        path: 'ubicacion',
        loadChildren: () => import('./pages/ubicacion/ubicacion.module').then(m => m.UbicacionPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

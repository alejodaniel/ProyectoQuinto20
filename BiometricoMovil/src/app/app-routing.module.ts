import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'main',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: 'registro',
        loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
    },
    {
        path: 'ubicacion',
        loadChildren: () => import('./pages/ubicacion/ubicacion.module').then(m => m.UbicacionPageModule)
    },
    {
        path: '', pathMatch: 'full', redirectTo: 'registro'
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

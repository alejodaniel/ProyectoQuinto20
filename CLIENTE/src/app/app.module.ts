import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxPaginationModule} from 'ngx-pagination';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {FechaPipePipe} from './services/pipes/fecha-pipe.pipe';
import {HoraPipe} from './services/pipes/hora.pipe';
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import { MainComponent } from './main/main.component';
import { UniqueDatePipe } from './services/pipes/unique-date.pipe';
import { UniqueNamePipe } from './services/pipes/unique-name.pipe';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    FechaPipePipe,
    HoraPipe,
    LoginComponent,
    MainComponent,
    UniqueDatePipe,
    UniqueNamePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

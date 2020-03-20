import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HelloComponent} from './hello.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {FechaPipePipe} from './services/pipes/fecha-pipe.pipe';
import {HoraPipe} from './services/pipes/hora.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    FechaPipePipe,
    HoraPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

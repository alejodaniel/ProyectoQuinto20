import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HelloComponent} from './hello.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import { FechaPipe } from './fecha.pipe';
import {DatePipe} from "@angular/common";
import { PdfComponent } from './pdf/pdf.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    FechaPipe,
    PdfComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}

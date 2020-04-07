import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {HttpClientModule} from '@angular/common/http';
import {Camera} from '@ionic-native/camera/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import { ImagePipe } from './services/image.pipe';


// @ts-ignore
@NgModule({
    declarations: [AppComponent, ImagePipe],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(),
        AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        Camera,
        FileTransfer,
        NativeGeocoder,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        FingerprintAIO
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

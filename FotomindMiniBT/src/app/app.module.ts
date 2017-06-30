import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { FotomindMiniBtPage } from '../pages/fotomind-mini-bt/fotomind-mini-bt';
import { ZeitrafferPage } from '../pages/zeitraffer/zeitraffer';
import { SelbstausloeserPage } from '../pages/selbstausloeser/selbstausloeser';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Toast } from '@ionic-native/toast';

@NgModule({
  declarations: [
    MyApp,
    BluetoothPage,
    FotomindMiniBtPage,
    ZeitrafferPage,
    SelbstausloeserPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BluetoothPage,
    FotomindMiniBtPage,
    ZeitrafferPage,
    SelbstausloeserPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    Toast,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

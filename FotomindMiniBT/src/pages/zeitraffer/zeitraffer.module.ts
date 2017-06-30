import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ZeitrafferPage } from './zeitraffer';

@NgModule({
  declarations: [
    ZeitrafferPage,
  ],
  imports: [
    IonicPageModule.forChild(ZeitrafferPage),
  ],
  exports: [
    ZeitrafferPage
  ]
})
export class ZeitrafferPageModule {}

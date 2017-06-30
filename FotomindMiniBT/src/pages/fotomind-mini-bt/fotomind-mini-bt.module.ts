import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FotomindMiniBtPage } from './fotomind-mini-bt';

@NgModule({
  declarations: [
    FotomindMiniBtPage,
  ],
  imports: [
    IonicPageModule.forChild(FotomindMiniBtPage),
  ],
  exports: [
    FotomindMiniBtPage
  ]
})
export class FotomindMiniBtPageModule {}

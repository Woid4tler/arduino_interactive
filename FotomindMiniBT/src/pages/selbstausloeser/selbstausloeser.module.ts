import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelbstausloeserPage } from './selbstausloeser';

@NgModule({
  declarations: [
    SelbstausloeserPage,
  ],
  imports: [
    IonicPageModule.forChild(SelbstausloeserPage),
  ],
  exports: [
    SelbstausloeserPage
  ]
})
export class SelbstausloeserPageModule {}

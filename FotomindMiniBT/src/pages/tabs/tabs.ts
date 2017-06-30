import { Component } from '@angular/core';

import { BluetoothPage } from '../bluetooth/bluetooth';
import { FotomindMiniBtPage } from '../fotomind-mini-bt/fotomind-mini-bt';
import { ZeitrafferPage } from '../zeitraffer/zeitraffer';
import { SelbstausloeserPage } from '../selbstausloeser/selbstausloeser';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BluetoothPage;
  tab2Root = FotomindMiniBtPage;
  tab3Root = ZeitrafferPage;
  tab4Root = SelbstausloeserPage;

  constructor() {

  }
}

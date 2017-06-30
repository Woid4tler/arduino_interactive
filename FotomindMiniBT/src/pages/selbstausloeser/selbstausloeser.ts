import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * Generated class for the SelbstausloeserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-selbstausloeser',
  templateUrl: 'selbstausloeser.html',
})
export class SelbstausloeserPage {

status: string = "no";
  timerDelay: number = 10;
  timerPictures: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public bluetoothSerial: BluetoothSerial) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelbstausloeserPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter SelbstausloeserPage');
    this.checkBluetooth('modi-timer');
  }

  startTimer() {
    console.log("timer-start+" + this.timerDelay + "#" + this.timerPictures + "\n");
    this.bluetoothSerial.write("timer-start+" + this.timerDelay + "#" + this.timerPictures + "\n");
  }

  checkBluetooth(modus){
    this.bluetoothSerial.isEnabled().then(
      (data)=> {
        console.log("Bluetooth is enabled!");
        this.bluetoothSerial.isConnected().then((data) => {
          this.bluetoothSerial.write(modus + '\n')
          this.subscribeBluetooth().subscribe(
            (data)=> {
              this.onDataReceived(data);
            }
          );
        });
      },
      (data)=> {
        console.log("Bluetooth is disabled!");
      });
  }

  subscribeBluetooth(){
      console.log("Subscribe");
      return this.bluetoothSerial.subscribe('\n');
  }

  onDataReceived(data) {
      console.log(data);
      if(data.indexOf("Modus") == 0){
        console.log(data.substr(data.indexOf("-")+1));
        this.status = data.substr(data.indexOf("-")+1);
      }
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the FotomindMiniBtPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-fotomind-mini-bt',
  templateUrl: 'fotomind-mini-bt.html',
})
export class FotomindMiniBtPage {

  public status: string = "no";

  constructor(public navCtrl: NavController, public navParams: NavParams, public bluetoothSerial: BluetoothSerial, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FotomindMiniBtPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter FotomindMiniBtPage');
    this.checkBluetooth('modi-manuell');
  }

  takePicture() {
    this.bluetoothSerial.write("trigger-camera\n");
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
      if(data.indexOf("photo-taken") == 0){
        let toast = this.toastCtrl.create({
          message: 'Photo was taken successfully!',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
//import { FotomindMiniBtPage } from '../fotomind-mini-bt/fotomind-mini-bt';

/**
 * Generated class for the BluetoothPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

  public var2: string;
  public bluetoothDeviceList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public bluetoothSerial: BluetoothSerial) {

    this.checkBluetooth();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BluetoothPage');
  }

  itemSelected(item: string) {
    this.connectBluetoothDevice(item).subscribe((data)=> {
      console.log("connected");
      this.bluetoothSerial.write('bt-connected\n')
      /*this.subscribeBluetooth().subscribe(
        (data)=> {
          this.onDataReceived(data);
        }
      );*/
      this.navCtrl.parent.select(1);
      //this.navCtrl.push(FotomindMiniBtPage);
    },
    (data)=> {
      console.log("not connected");
    });
  }

  checkBluetooth(){
    this.bluetoothSerial.isEnabled().then(
      (data)=> {
        console.log("Bluetooth is enabled!");
        this.getAllBluetoothDevices();
      },
      (data)=> {
        console.log("Bluetooth is diabled!");
        this.enableBluetooth();
      });
  }

  enableBluetooth(){
    this.bluetoothSerial.enable().then(
      (data)=> {
        console.log("Bluetooth is enabled!");
        this.getAllBluetoothDevices();
      },
      (data)=> {
        console.log("The user did *not* enable Bluetooth");
      });
  }

  isBluetoothConnected(){
    this.bluetoothSerial.isConnected().then((data) => {
      return true;
    },
    (data) => {
      return false;
    });
  }

  getAllBluetoothDevices(){
      this.bluetoothSerial.list().then((allDevices) => {
        this.bluetoothDeviceList = allDevices;
        if(!(this.bluetoothDeviceList.length > 0)){
          this.var2 = "could not find any bluetooth devices";
        }
      });
  }
  connectBluetoothDevice(deviceID) {
      console.log("Requesting connection to " + deviceID);
      return this.bluetoothSerial.connect(deviceID);
  }

  disconnectBluetooth() {
      console.log("trennen");
      this.bluetoothSerial.disconnect().then(
        (data)=> {
          console.log(data);
        });
  }

  subscribeBluetooth(){
      //bluetoothSerial.unsubscribe(console.log("Unsuscribe Success"), console.log("Unsuscribe Error"));
      console.log("Subscribe");
      return this.bluetoothSerial.subscribe('\n');
  }

  onDataReceived(data) {
      console.log(data);
      if(data.indexOf("Modus") == 0){
        console.log(data.substr(data.indexOf("-")+1));
        //$scope.setActualModus(message.substr(message.indexOf("-")+1));
      }
  }

}

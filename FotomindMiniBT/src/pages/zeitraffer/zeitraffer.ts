import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * Generated class for the ZeitrafferPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-zeitraffer',
  templateUrl: 'zeitraffer.html',
})
export class ZeitrafferPage {

  status: string = "no";
  timelapseStatus: string = "inaktiv";
  timelapseDelayMinutes: number = 0;
  timelapseDelaySeconds: number = 10;
  timelapseDelay: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public bluetoothSerial: BluetoothSerial) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ZeitrafferPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ZeitrafferPage');
    this.checkBluetooth('modi-timelapse');
  }


  startTimelapse() {
    this.timelapseDelay = (this.timelapseDelaySeconds + (this.timelapseDelayMinutes * 60));
    console.log(this.timelapseDelay);

    this.bluetoothSerial.write("timelapse-start+" + this.timelapseDelay + "\n");
  }

  stopTimelapse() {
    this.bluetoothSerial.write("timelapse-stop\n");
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
      if(data.indexOf("timelapse-active") == 0){
        this.setTimelapseStatus("Zeitraffer gestartet!");
        console.log(this.timelapseStatus);
      }
      else if(data.indexOf("timelapse-inactive") == 0){
        this.setTimelapseStatus("Zeitraffer gestoppt!");
        console.log(this.timelapseStatus);
      }
  }

  setTimelapseStatus(status){
    this.timelapseStatus = status;
  }

}

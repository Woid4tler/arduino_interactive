#include <Arduino.h>

//INCLUDES
#include <Wire.h>
#include <DS3231.h>

//PINS
const int ledYellowPin = 6;
const int ledGreenPin = 7;
const int potiPin = 2;
const int piezoPin = A0;
const int photoResPin = A1;
const int pirPin = 4;
const int flashPin = 8;
const int shutterPin = 9;
const int focusPin = 10;
const int buttonPin = 11;
const int switchPin = 12;
const int laserPin = 3;

//constant Variables
const int threshold = 500;

//Variables
int potiVal = 0, photoResVal;
int photoResThreshold = 600;
int sensorReading = 0;
int ledState = LOW;
int pirVal;
int shutterDelay = 0;
String message = "";
int buttonState = 0;
int switchState = 0;
int piezoVal = 0;
int lichtschrankeActive = 0;
String actualModi = "Manuell";
DS3231 clock;
RTCDateTime dt;
unsigned long timelapseDelay = 10, timelapseStart, actualTime, timeDiff;
unsigned long timerDelay = 3, timerStart, timerPictureCount = 0, timerPictures= 1;

bool timelapseActive = false, timerActive = false;

String watchControllTime, actualClock;

String test;


// the setup routine runs once when you press reset:
void setup() {
  // initialize
  pinMode(ledYellowPin, OUTPUT);
  pinMode(ledGreenPin, OUTPUT);
  pinMode(pirPin, INPUT);
  pinMode(potiPin, INPUT);
  pinMode(shutterPin, OUTPUT);
  pinMode(focusPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  pinMode(switchPin, INPUT);
  pinMode(flashPin, OUTPUT);
  pinMode(laserPin, OUTPUT);
  Serial.begin(9600);

  clock.begin();
  clock.setDateTime(__DATE__, __TIME__);

  digitalWrite(ledYellowPin, HIGH);
  delay(100);
  digitalWrite(ledYellowPin, LOW);
  digitalWrite(ledGreenPin, HIGH);
  delay(100);
  digitalWrite(ledGreenPin, LOW);
  digitalWrite(ledYellowPin, HIGH);
  delay(100);
  digitalWrite(ledYellowPin, LOW);
  digitalWrite(ledGreenPin, HIGH);
  delay(100);
  digitalWrite(ledGreenPin, LOW);

  analogWrite(laserPin, 150);
  delay(200);
  analogWrite(laserPin, 0);

  actualModi = "Manuell";
  //actualModi = "Lichtschranke";
  //watchControllTime = "15:02";
  //timerStart = seconds();
  //timerPictures = 2;
  //timerPictureCount = 0;
}

// the loop routine runs over and over again forever:
void loop() {

  if(Serial.available()){
    message = Serial.readStringUntil('\n');
    //Serial.print(message + '\n');

    if (message == "trigger-camera")
    {
      triggerCamera(1000, shutterDelay);
    }
    else if (message == "modi-manuell")
    {
      setModi("Manuell");
    }
    else if (message.indexOf("modi-timelapse") == 0)
    {
      //Serial.print("Zeitraffer\n");
      setModi("Zeitraffer");
    }
    else if (message.indexOf("timelapse-start") == 0)
    {
      timelapseDelay = message.substring(message.indexOf('+') + 1).toInt();
      timelapseStart = seconds();
      timelapseActive = true;
      Serial.print("timelapse-started\n");
    }
    else if (message == "timelapse-stop")
    {
      timelapseActive = false;
      Serial.print("timelapse-stopped\n");
    }
    else if (message.indexOf("modi-timer") == 0)
    {
      setModi("Selbstausloeser");
    }
    else if (message.indexOf("timer-start") == 0)
    {
      timerDelay = message.substring(message.indexOf('+'), message.indexOf('#')).toInt();
      timerPictures = message.substring(message.indexOf('#') + 1).toInt();
      timerStart = seconds();
      timerPictureCount = 0;
      timerActive = true;
    }
    else if (message == "modi-watchcontroll+20:00")
    {
      setModi("Uhrzeitsteuerung");
      watchControllTime = message.substring(message.indexOf('+') + 1);
    }
  }

  actualTime = seconds();

  if(actualModi =="Zeitraffer"){
      switchState = digitalRead(switchPin);
      if(timelapseActive || switchState == HIGH){
          Serial.print("timelapse-active\n");
          timeDiff = actualTime - timelapseStart;
          if(timeDiff%timelapseDelay == 0){
            shootFotoWithoutFocus(500);
            delay(600);
          }
      }
      else{
          Serial.print("timelapse-inactive\n");
      }
  }
  else if(actualModi =="Uhrzeitsteuerung"){
     dt = clock.getDateTime();
     actualClock = clock.dateFormat("H:i", dt);
     //Serial.println(actualClock);
     //Serial.println(watchControllTime);
     if(actualClock == watchControllTime){
         shootFotoWithoutFocus(200);
     }
  }
  else if(actualModi =="Selbstausloeser" && timerActive){
    timeDiff = actualTime - timerStart;
      if(timeDiff%timerDelay == 0 && timeDiff > 0 && timerPictureCount < timerPictures){
        shootFotoWithoutFocus(200);
        delay(600);
        timerPictureCount++;
      }
      if(timerPictureCount == timerPictures){
          timerActive = false;
      }
  }
  else if(actualModi == "Lichtschranke"){
      buttonState = digitalRead(buttonPin);
      switchState = digitalRead(switchPin);

      photoResVal = analogRead(photoResPin);
      Serial.println(photoResVal);

      if (switchState == HIGH)
      {
          analogWrite(laserPin, 200);
      }
      else{
          analogWrite(laserPin, 0);
      }
      if (switchState == HIGH && buttonState == HIGH)
      {
          lichtschrankeActive = 1;
      }
      if (switchState == HIGH && lichtschrankeActive == 1){
          digitalWrite(shutterPin, HIGH);
          digitalWrite(ledGreenPin, HIGH);
          photoResVal = analogRead(photoResPin);
          Serial.print(photoResVal + '\n');
          if(photoResVal < photoResThreshold){
              delay(25);
              shootFlash();
              delay(100);
              digitalWrite(shutterPin, LOW);
              digitalWrite(ledGreenPin, LOW);
              lichtschrankeActive = 0;
          }
      }
      else{
          digitalWrite(shutterPin, LOW);
          digitalWrite(ledGreenPin, LOW);
      }
  }
  else if(actualModi == "Highspeed"){
      buttonState = digitalRead(buttonPin);
      switchState = digitalRead(switchPin);

      photoResVal = analogRead(photoResPin);
      Serial.println(photoResVal);

      if (switchState == HIGH)
      {
          analogWrite(laserPin, 200);
      }
      else{
          analogWrite(laserPin, 0);
      }
      if (switchState == HIGH && buttonState == HIGH)
      {
          lichtschrankeActive = 1;
      }
      if (switchState == HIGH && lichtschrankeActive == 1){
          if(photoResVal < photoResThreshold){
              digitalWrite(shutterPin, HIGH);
              digitalWrite(ledGreenPin, HIGH);
              delay(10);
              digitalWrite(shutterPin, LOW);
              digitalWrite(ledGreenPin, LOW);
              lichtschrankeActive = 0;
          }
      }
  }
  else{
    buttonState = digitalRead(buttonPin);
    switchState = digitalRead(switchPin);


    potiVal = analogRead(potiPin);
    shutterDelay = map(potiVal, 0, 1023, 0, 8000);
    //Serial.println(shutterDelay);

    piezoVal = 1024 - analogRead(piezoPin);

    pirVal = digitalRead(pirPin);
    //Serial.println(pirVal);

    if (buttonState == HIGH && switchState == HIGH)
    {
        //shootFlash();
        triggerCamera(1000, shutterDelay);
    }
  }
  delay(50);
  if(actualTime%3 == 0){
    Serial.print("Modus-" + actualModi + '\n');
  }
}

void setModi(String modus){
  actualModi = modus;
  Serial.print("Modus-" + actualModi + '\n');
}

unsigned long seconds(){
  return millis()/1000;
}

void shootFotoWithoutFocus(int shutterDelayTime){
  digitalWrite(shutterPin, HIGH);
  digitalWrite(ledGreenPin, HIGH);
  delay(shutterDelayTime);
  digitalWrite(ledGreenPin, LOW);
  digitalWrite(shutterPin, LOW);
  delay(100);
}

void shootFlash(){
  digitalWrite(flashPin, HIGH);
  digitalWrite(ledYellowPin, HIGH);
  delay(50);
  digitalWrite(ledYellowPin, LOW);
  digitalWrite(flashPin, LOW);
  delay(50);
}


void triggerCamera(int focusDelay, int shutterDelayTime){
  digitalWrite(focusPin, HIGH);
  digitalWrite(ledYellowPin, HIGH);
  delay(focusDelay);
  digitalWrite(focusPin, LOW);
  digitalWrite(ledYellowPin, LOW);
  delay(200);
  digitalWrite(shutterPin, HIGH);
  digitalWrite(ledGreenPin, HIGH);
  delay(shutterDelayTime);
  digitalWrite(ledGreenPin, LOW);
  digitalWrite(shutterPin, LOW);
  Serial.print("photo-taken\n");
  delay(200);
}

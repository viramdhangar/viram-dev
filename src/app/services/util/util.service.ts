import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export async function toastMessage(message: string, toastController: ToastController): Promise<void> {
  const toast = await toastController.create({
    message: message,
    position: 'middle',
    duration: 4000,
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  return await toast.present();
}

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }
}

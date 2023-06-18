import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export async function set(key: string, value: any): Promise<void> {
  await Preferences.set({
    key: key,
    value: JSON.stringify(value),
  });
}
export async function get(key: string): Promise<any> {
  const item = await Preferences.get({ key: key });
  return JSON.parse(item.value+"");
}
export async function remove(key: string): Promise<void> {
  await Preferences.remove({
    key: key,
  });
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
}

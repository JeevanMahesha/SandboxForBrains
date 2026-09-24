import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mobileUrl', standalone: true, pure: true })
export class MobileUrlPipe implements PipeTransform {
  transform(mobileNumber: string, type: 'tel' | 'whatsapp'): string {
    // Stored numbers are always "+91XXXXXXXXXX", so the digits already carry the country code.
    const digits = mobileNumber.replace(/\D/g, '');
    const whatsappMessage = encodeURIComponent('Hi This is Jeevan');
    return type === 'tel' ? `tel:+${digits}` : `https://wa.me/${digits}?text=${whatsappMessage}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mobileUrl', standalone: true, pure: true })
export class MobileUrlPipe implements PipeTransform {
  transform(mobileNumber: string, type: 'tel' | 'whatsapp'): string {
    const digits = mobileNumber.replace(/\D/g, '');
    const whatsappMessage = encodeURIComponent('Hi This is Jeevan');
    return type === 'tel' ? `tel:+91${digits}` : `https://wa.me/${digits}?text=${whatsappMessage}`;
  }
}

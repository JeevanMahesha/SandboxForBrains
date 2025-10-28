import { Injectable, signal } from '@angular/core';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private mockProfiles: Profile[] = [
    { id: 1, name: 'Akila M', caste: 'Makaram', city: 'Chennai', state: 'Tamil Nadu', profileStatus: 'Rejected', star: 'Thiruvonam', starMatchScore: 8 },
    { id: 2, name: 'Akila M', caste: 'Makaram', city: 'Chennai', state: 'Tamil Nadu', profileStatus: 'Rejected', star: 'Thiruvonam', starMatchScore: 8 },
    { id: 3, name: 'Anushya', caste: 'Mesham', city: 'Chennai', state: 'Tamil Nadu', profileStatus: 'Unknown', star: 'Bharani', starMatchScore: 8 },
    { id: 4, name: 'Birunda R', caste: 'Dhanusu', city: 'Namakkal', state: 'Tamil Nadu', profileStatus: 'Rejected', star: 'Pooraadam', starMatchScore: 6 },
    { id: 5, name: 'Idhayapriya E', caste: 'Meenam', city: 'Bengaluru Rural', state: 'Karnataka', profileStatus: 'New', star: 'Revathi', starMatchScore: 10 },
    { id: 6, name: 'Indumathi', caste: 'Viruchigam', city: 'Chennai', state: 'Tamil Nadu', profileStatus: 'Rejected', star: 'Kettai', starMatchScore: 6 },
    { id: 7, name: 'Keerthana', caste: 'Mithunam', city: 'Chennai', state: 'Tamil Nadu', profileStatus: 'Rejected', star: 'Thiruvathirai', starMatchScore: 8 },
  ];

  profiles = signal<Profile[]>(this.mockProfiles);
  filteredProfiles = signal<Profile[]>(this.mockProfiles);

  filterProfiles(searchTerm: string): void {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredProfiles.set(this.profiles());
    } else {
      this.filteredProfiles.set(
        this.profiles().filter(profile => 
          profile.name.toLowerCase().includes(term)
        )
      );
    }
  }

  clearSearch(): void {
    this.filteredProfiles.set(this.profiles());
  }

  deleteProfile(id: number): void {
    const updated = this.profiles().filter(p => p.id !== id);
    this.profiles.set(updated);
    this.filteredProfiles.set(updated);
  }
}

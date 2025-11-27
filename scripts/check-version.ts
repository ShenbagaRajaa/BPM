import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../src/environment/environment';

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  private currentVersion = environment.version;
  private readonly CHECK_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
  private readonly RELOAD_FLAG = 'version_reloaded';

  constructor(private http: HttpClient) {}

  public initVersionCheck(): void {
    console.log("Version check initialized");

    // Clear reload flag if current app version matches
    const reloadedFor = localStorage.getItem(this.RELOAD_FLAG);
    if (reloadedFor === this.currentVersion) {
      localStorage.removeItem(this.RELOAD_FLAG);
    }

    // start checking periodically
    setInterval(() => {
      this.checkVersion();
    }, this.CHECK_INTERVAL);
  }

  private checkVersion(): void {
    this.http.get<{ uatVersion: string; prodVersion: string }>('/assets/version.json').subscribe({
      next: (res) => {
        const latestVersion = res.uatVersion || res.prodVersion;
        console.log("Checking version:", { latestVersion, current: this.currentVersion });

        if (latestVersion !== this.currentVersion) {
          const reloadedFor = localStorage.getItem(this.RELOAD_FLAG);
          if (reloadedFor !== latestVersion) {
            console.log(`New version detected (${latestVersion}). Reloading app...`);
            localStorage.setItem(this.RELOAD_FLAG, latestVersion);
            window.location.reload();
          } else {
            console.log('Already reloaded for this version. Skipping reload.');
          }
        }
      },
      error: (err) => console.error('Version check failed:', err)
    });
  }
}

import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { StorageMap } from '@ngx-pwa/local-storage';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService, User } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-pwa-starter';

  users: User[] = [];
  private readonly publicKey = environment.keys.webPushPublicKey;

  constructor(
    private data: DataService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private app: ApplicationRef,
    private storage: StorageMap
  ) {
    this.updateApp();
    this.checkForUpdate();
  }

  ngOnInit(): void {
    addEventListener('offline', () => {
      alert("You're offline");
    });
    addEventListener('online', () => {
      alert("You're back online");
    });

    this.pushSubscription();
    this.swPush.messages.subscribe((message) => console.log(message));
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      window.open(notification.data.url);
    });
    this.data.getUsers().subscribe((users) => (this.users = users));
  }

  updateApp() {
    if (!this.swUpdate.isEnabled) {
      console.log('SW update not Enabled 🙁');
      return;
    }
    this.swUpdate.available.subscribe((event) => {
      if (confirm('New version available. Would you like to update?')) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    });
    this.swUpdate.activated.subscribe((event) => {
      console.log('Previous: ' + event.previous, ' Current: ' + event.current);
    });
  }

  checkForUpdate() {
    this.app.isStable.subscribe((stable) => {
      if (stable) {
        const timeInterval = interval(12 * 60 * 60 * 1000);
        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => {
            console.log('Checked for latest app updates.');
          });
        });
      }
    });
  }

  pushSubscription() {
    if (!this.swPush.isEnabled) {
      console.log('Notifications not Enabled 🙁');
      return;
    }
    this.swPush
      .requestSubscription({
        serverPublicKey: this.publicKey,
      })
      .then((sub) => {
        // Make a post call to serve
        console.log(JSON.stringify(sub));
      })
      .catch((err) => console.log(err));
  }
}

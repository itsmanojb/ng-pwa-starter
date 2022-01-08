import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { DataService, User } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ng-pwa-starter';

  users: User[] = [];
  private readonly publicKey = 'BMB3c11-O71Ir1Q59PDLQaIXdVN8G7wXANt5h1n6Jl0gras5Bu54DHRNUv3CPQMYjvRShUJ5q5i96PBWDDGLqBU';

  constructor(
    private data: DataService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private app: ApplicationRef
  ) {
    this.updateApp();
    this.checkForUpdate();
  }

  ngOnInit(): void {
    this.pushSubscription();
    this.swPush.messages.subscribe(message => console.log(message));
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      window.open(notification.data.url);
    });
    this.data.getUsers()
      .subscribe(users => this.users = users);
  }

  updateApp() {
    if (!this.swUpdate.isEnabled) {
      console.log('SW update not Enabled 🙁');
      return;
    }
    this.swUpdate.available.subscribe((event) => {
      if (confirm('New version available. Would you like to update?')) {
        this.swUpdate.activateUpdate().then(() => location.reload())
      }
    })
    this.swUpdate.activated.subscribe((event) => {
      console.log('Previous: ' + event.previous, ' Current: ' + event.current);
    })
  }

  checkForUpdate() {
    this.app.isStable.subscribe((stable) => {
      if (stable) {
        const timeInterval = interval(12 * 60 * 60 * 1000);
        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => {
            console.log('Checked for latest app updates.');
          })
        })
      }
    })
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

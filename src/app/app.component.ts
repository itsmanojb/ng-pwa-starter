import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
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

  constructor(
    private data: DataService,
    private swUpdate: SwUpdate,
    private app: ApplicationRef
  ) {
    this.updateApp();
    this.checkForUpdate();
  }

  ngOnInit(): void {
    this.data.getUsers()
      .subscribe(users => this.users = users);
  }

  updateApp() {
    if (!this.swUpdate.isEnabled) {
      console.log('SW update not Enabled 🙁');
      return
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

}

import { Component, OnInit } from '@angular/core';
import { DataService, User } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ng-pwa-starter';

  users: User[] = [];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.getUsers()
      .subscribe(users => this.users = users);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit{
  selectedTabIndex = 0;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.routeConfig?.path == 'login'){
      this.selectedTabIndex = 0;
    }else if(this.route.snapshot.routeConfig?.path == 'register'){
      this.selectedTabIndex = 1;
    }
  }
}

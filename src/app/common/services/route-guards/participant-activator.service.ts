import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, ActivatedRoute, Router, RouterStateSnapshot, CanDeactivate, UrlTree } from '@angular/router';
import { ExperimentService } from '../experiment.service';
import { Observable } from 'rxjs';
import { ParticipantViewComponent } from 'src/app/participant-view/participant-view.component';

@Injectable({
  providedIn: 'root'
})

//TODO: review if this is needed
export class ParticipantActivatorService implements CanActivate, CanDeactivate<ParticipantViewComponent> {

  constructor(private readonly experimentService: ExperimentService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    let experimentExists = await new Promise<boolean>((resolve) => {
      this.experimentService.getDescription(state.url.split('/')[3]).subscribe({
        next: () => resolve(true),
        error: () => resolve(false)
      });
    });

    if(!experimentExists)
			this.router.navigate(['/404'])

    return experimentExists;
  }

  canDeactivate(component: ParticipantViewComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("in canDeactivate");
    if (!component.finished)
		  return window.confirm('You have not finished the experiment, so all progress will be lost. Do you really want to leave?');
	  return true;
  }
}

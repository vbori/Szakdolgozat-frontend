import { ParticipantViewComponent } from "src/app/participant-view/participant-view.component";

export const participantDeactivator = (component: ParticipantViewComponent) => {
  if (!component.finished)
		return window.confirm('You have not finished the experiment, so all progress will be lost. Do you really want to leave?');
	return true;
}

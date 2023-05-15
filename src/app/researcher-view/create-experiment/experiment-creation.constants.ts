import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ExperimentCreationConstants {
    public readonly MAX_TOTAL_EXPERIMENT_ROUND_NUM = 50;
    public readonly MAX_PARTICIPANT_NUM = 50;
    public readonly MAX_QUESTION_NUM = 20;
    public readonly MAX_OPTION_NUM = 10;
    public readonly MIN_CANVAS_HEIGHT = 400;
    public readonly MIN_CANVAS_WIDTH = 400;
    public readonly MAX_CANVAS_HEIGHT = 600;
    public readonly MAX_CANVAS_WIDTH = 1000;
    public readonly MAX_SHAPE_SIZE = 400;
    public readonly MIN_SHAPE_SIZE = 10;
    public readonly MAX_DISTRACTION_DURATION_TIME = 5000
    public readonly MIN_FLASHING_FREQUENCY = 100;
    public readonly MAX_FLASHING_FREQUENCY = 1000;
    public readonly MIN_TRACKING_FREQUENCY = 100;
    public readonly MAX_TRACKING_FREQUENCY = 1000;
}

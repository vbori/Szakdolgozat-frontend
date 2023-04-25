import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ExperimentCreationConstants {
    public readonly MAX_TOTAL_EXPERIMENT_ROUND_NUM = 100;
    public readonly MAX_PARTICIPANT_NUM = 50;
    public readonly MIN_CANVAS_HEIGHT = 400;
    public readonly MIN_CANVAS_WIDTH = 400;
    public readonly MAX_CANVAS_HEIGHT = 700;
    public readonly MAX_CANVAS_WIDTH = 1000;
    public readonly MAX_SHAPE_SIZE = 400;
    public readonly MIN_SHAPE_SIZE = 10;
    public readonly MAX_REST_TIME_SEC = 60;
    public readonly MAX_PRACTICE_ROUND_NUM = 10;
    public readonly MAX_DISTRACTION_DURATION_TIME = 5000
    public readonly MIN_FLASHING_FREQUENCY = 100;
    public readonly MAX_FLASHING_FREQUENCY = 1000;
}

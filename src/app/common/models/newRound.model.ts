export interface NewRound extends fabric.Object {
  target: boolean;
  flashColor?: string;
  flashFrequency?: number;
  baseColor?: string;
  backgroundFlashColor?: string;
  backgroundFlashFrequency?: number;
  canvasHeight: number;
  canvasWidth: number;
}

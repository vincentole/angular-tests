import { NgClass, NgFor, NgIf, AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { Subject, map, merge, of, scan, startWith, withLatestFrom } from "rxjs";

let level_1 = new Array(25).fill(false);
[10, 12, 14].forEach((i) => (level_1[i] = true));

let level_2 = new Array(25).fill(false);
[7, 11, 12, 13, 17].forEach((i) => (level_2[i] = true));

const levels = [level_1, level_2];

function getLevel(i: number) {
  return [...levels[i]];
}

@Component({
  selector: "app-lights-out-declarative",
  standalone: true,
  imports: [NgFor, NgClass, NgIf, AsyncPipe],
  template: `
    <div class="grid grid-cols-5 grid-rows-5 gap-4">
      <button
        *ngFor="let isCellActive of grid$ | async; index as i"
        class="rounded-md p-12"
        [class.bg-red-500]="isCellActive"
        [class.bg-stone-400]="!isCellActive"
        (click)="(toggleTrigger$.next)"
      ></button>
    </div>
    <p class="text-4xl mt-8" [ngClass]="{ invisible: !(won$ | async) }">
      You won!
    </p>
    <button
      class="mr-1 mt-4 border rounded-lg px-4 py-1"
      (click)="resetTrigger$.next()"
    >
      Reset Game
    </button>
    <button
      class="ml-1 mt-4 border rounded-lg px-4 py-1 bg-stone-300 text-stone-900 font-bold"
      *ngIf="won$ | async"
      (click)="nextLevelTrigger$.next()"
    >
      Next Level
    </button>
  `,
})
export default class LightsOutDeclarativeComponent {
  // Sources
  resetTrigger$ = new Subject<void>();
  nextLevelTrigger$ = new Subject<void>();
  toggleTrigger$ = new Subject<number>();

  // States
  currentLevel$ = merge(
    of({}),
    this.nextLevelTrigger$.pipe(map(() => ({ delta: 1 }))),
  ).pipe(
    scan((acc, curr: { delta?: number }) => {
      if (!curr.delta) return acc;

      if (acc + curr.delta >= levels.length) {
        return 0;
      }
      return acc + curr.delta;
    }, 0),
  );

  grid$ = merge(
    of({}),
    this.resetTrigger$.pipe(
      withLatestFrom(this.currentLevel$),
      map(([, level]) => ({ level })),
    ),
    this.currentLevel$.pipe(
      map((level) => ({
        level,
      })),
    ),
    this.toggleTrigger$.pipe(map((i) => ({ i }))),
  ).pipe(
    scan<{ level?: number; i?: number; reset?: boolean }, boolean[]>(
      (acc, curr) => {
        if (curr.level !== undefined) {
          return getLevel(curr.level);
        }

        if (curr.i) {
          acc[curr.i] = !acc[curr.i];

          if (curr.i - 5 > 0) {
            acc[curr.i - 5] = !acc[curr.i - 5];
          }

          if (curr.i % 5 !== 0) {
            acc[curr.i - 1] = !acc[curr.i - 1];
          }

          if (curr.i + 5 < acc.length) {
            acc[curr.i + 5] = !acc[curr.i + 5];
          }

          if ((curr.i + 1) % 5 !== 0) {
            acc[curr.i + 1] = !acc[curr.i + 1];
          }
        }

        return acc;
      },
      getLevel(0),
    ),
  );

  won$ = merge(
    merge(this.resetTrigger$, this.nextLevelTrigger$).pipe(map(() => false)),
    this.toggleTrigger$.pipe(
      withLatestFrom(this.grid$),
      map(([, grid]) => grid.every((v) => v === false)),
    ),
  ).pipe(startWith(false));

  test = this.won$.pipe(
  )

}

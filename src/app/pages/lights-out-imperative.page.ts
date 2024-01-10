import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lights-out-imperative',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  template: `
    <div class="grid grid-cols-5 grid-rows-5 gap-4">
      <button
        *ngFor="let isCellActive of grid; index as i"
        class="rounded-md p-12"
        [class.bg-red-500]="isCellActive"
        [class.bg-stone-400]="!isCellActive"
        (click)="toggle(i)"
      ></button>
    </div>
    <p class="text-4xl mt-8" [ngClass]="{ invisible: !won }">You won!</p>
    <button class="mr-1 mt-4 border rounded-lg px-4 py-1" (click)="reset()">
      Reset Game
    </button>
    <button
      class="ml-1 mt-4 border rounded-lg px-4 py-1 bg-stone-300 text-stone-900 font-bold"
      *ngIf="won"
      (click)="nextLevel()"
    >
      Next Level
    </button>
  `,
})
export default class LightsOutImperativeComponent implements OnInit {
  grid: boolean[] = new Array(25).fill(false);
  levels: boolean[][] = [];
  current_level = 0;
  won = false;

  ngOnInit(): void {
    let level_1 = new Array(25).fill(false);
    [10, 12, 14].forEach((i) => (level_1[i] = true));

    let level_2 = new Array(25).fill(false);
    [5, 7, 9].forEach((i) => (level_2[i] = true));

    this.levels = [level_1, level_2];

    this.setGrid(this.levels[this.current_level]);
  }

  toggle(i: number): void {
    this.grid[i] = !this.grid[i];

    if (i - 5 > 0) {
      this.grid[i - 5] = !this.grid[i - 5];
    }

    if (i % 5 !== 0) {
      this.grid[i - 1] = !this.grid[i - 1];
    }

    if (i + 5 < this.grid.length) {
      this.grid[i + 5] = !this.grid[i + 5];
    }

    if ((i + 1) % 5 !== 0) {
      this.grid[i + 1] = !this.grid[i + 1];
    }

    if (this.grid.every((v) => v === false)) {
      this.won = true;
    }
  }

  reset(): void {
    this.setGrid(this.levels[this.current_level]);
    this.won = false;
  }

  nextLevel(): void {
    if (this.current_level < this.levels.length - 1) {
      this.current_level += 1;
    } else {
      this.current_level = 0;
    }
    this.setGrid(this.levels[this.current_level]);
    this.won = false;
  }

  setGrid(grid: boolean[]): void {
    this.grid = [...grid];
  }
}

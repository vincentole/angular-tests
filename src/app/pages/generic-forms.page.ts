import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ElementId = string;
type Label = string;
type OptionId = string;

type InputText = {
  id: ElementId;
  type: 'input_text';
  label: Label;
  defaultValue: string | undefined;
};
type InputNumber = {
  id: ElementId;
  type: 'input_number';
  label: Label;
  defaultValue: number | undefined;
};
type InputSelect = {
  id: ElementId;
  type: 'select';
  label: Label;
  options: OptionId[];
  defaultValue: OptionId;
};

type FormElements = InputText | InputNumber | InputSelect;
type FormConfig = FormElements[];

type ValuesChanged = { [key: ElementId]: string | null };

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  template: `
    <form
      *ngIf="formGroup"
      [formGroup]="formGroup"
      class="flex flex-col gap-2 flex-start"
    >
      <ng-container *ngFor="let element of formConfig">
        <!-- Input Text -->
        <ng-container *ngIf="element.type === 'input_text'">
          <label for="{{ element.id }}">{{ element.label }}</label>
          <input
            id="{{ element.id }}"
            type="text"
            class="border p-1"
            [formControlName]="element.id"
          />
        </ng-container>
        <!-- Input Number -->
        <ng-container *ngIf="element.type === 'input_number'">
          <label for="{{ element.id }}">{{ element.label }}</label>
          <input
            id="{{ element.id }}"
            type="number"
            class="border p-1"
            [formControlName]="element.id"
          />
        </ng-container>
        <!-- Select -->
        <ng-container *ngIf="element.type === 'select'">
          <label for="{{ element.id }}">{{ element.label }}</label>
          <select
            id="{{ element.id }}"
            class="border p-1"
            [formControlName]="element.id"
          >
            <option *ngFor="let option of element.options" value="{{ option }}">
              {{ option }}
            </option>
          </select>
        </ng-container>
      </ng-container>
    </form>
  `,
})
export class GenericFormComponent {
  destroyRef = inject(DestroyRef);
  fb = inject(FormBuilder);

  @Input({ required: true }) formConfig!: FormConfig;
  @Output() valuesChanged = new EventEmitter<ValuesChanged>();

  formGroup?: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup(
      this.formConfig.reduce((fg, element) => {
        fg[element.id] = new FormControl(element.defaultValue, {});
        return fg;
      }, {} as { [key: ElementId]: FormControl })
    );

    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formValues) => {
        this.valuesChanged.emit(formValues);
      });
  }
}

@Component({
  selector: 'app-generic-forms',
  standalone: true,
  imports: [GenericFormComponent],
  template: `<app-generic-form [formConfig]="formConfig" />`,
})
export default class GenericFormsComponent {
  formConfig: FormConfig = [
    {
      id: 'username',
      type: 'input_text',
      label: 'Username',
      defaultValue: 'vincentole',
    },
    {
      id: 'count',
      type: 'input_number',
      label: 'Count',
      defaultValue: undefined,
    },
    {
      id: 'distros',
      type: 'select',
      label: 'Distros',
      options: ['Ubuntu', 'Arch'],
      defaultValue: 'Ubuntu',
    },
  ];
}

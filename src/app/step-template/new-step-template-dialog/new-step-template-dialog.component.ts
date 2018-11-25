import { Component, Input, EventEmitter, Output, Inject, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Step, StepTemplateService } from '../step-template.service';

@Component({
  selector: 'app-new-step-template-dialog',
  templateUrl: 'new-step-template-dialog.component.html',
  styleUrls: ['new-step-template-dialog.component.scss'],
})
export class NewStepTemplateDialogComponent implements OnDestroy {
  _form: FormGroup;

  /** tela de tablets e celulares */
  _verySmallScreen = false;

  /** tela de monitores pequenos */
  _smallScreen = false;

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _dialogRef: MatDialogRef<NewStepTemplateDialogComponent>, private _fb: FormBuilder,
    private _breakpointObserver: BreakpointObserver, private _componentService: StepTemplateService) {
    this._form = this._fb.group({
      name: [null, Validators.required],
      startDate: null,
      endDate: null
    })
    if (this.data && this.data.step) {
      this._form.patchValue({
        name: data.step.name,
        startDate: data.step.startDate,
        endDate: data.step.endDate
      });
    }

    const largeScreen = '(max-width: 1200px)';
    const verySmallScreen = '(max-width: 780px)';
    this._breakpointObserver
      .observe([largeScreen, verySmallScreen])
      .pipe(takeUntil(this._destroy$))
      .subscribe((bpState: BreakpointState) => {
        this._smallScreen = bpState.breakpoints[largeScreen];
        this._verySmallScreen = bpState.breakpoints[verySmallScreen];
      });
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  /** fecha o diálogo e repassa no nome */
  _submitForm() {
    if (this.data && this.data.step) {
      this.data.step.name = this._form.value.name;
      this.data.step.startDate = this._form.value.startDate;
      this.data.step.endDate = this._form.value.endDate;
      this._dialogRef.close(null);
    } else {
      this._dialogRef.close(this._form.value);
    }
  }

  get _datesClass(): any {
    return {
      'saga-dialog-form-container-dates': !this._verySmallScreen,
      'saga-dialog-form-container-dates-small': this._verySmallScreen,
    }
  }

  get _maxMinDate(): Date {
    return this._componentService.maxMinDate(this.data.step, this.data.maxDate);
  }

  get _minMinDate(): Date {
    return this._componentService.minMinDate(this.data.minDate);
  }

  get _minMaxDate(): Date {
    return this._componentService.minMaxDate(this.data.step, this.data.minDate);
  }

  get _maxMaxDate(): Date {
    return this._componentService.maxMaxDate(this.data.maxDate);
  }
}
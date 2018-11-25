import { Component, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MatDialog, MatExpansionPanel } from '@angular/material';

import { NewStepTemplateDialogComponent } from './new-step-template-dialog/new-step-template-dialog.component';

import { Status, Step, User } from './step-template.service';

import * as moment from 'moment';
type Moment = moment.Moment;

@Component({
  selector: 'app-step-template',
  templateUrl: 'step-template.component.html',
  styleUrls: ['step-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StepTemplateComponent {
  /** atividade corrente mostrada no expansion */
  private _step: Step;
  @Input()
  get step(): Step { return this._step };
  set step(step: Step) {
    this._step = step;
    setTimeout(() => this._updateStatus());
  }

  /** atividade pai da atividade corrente */
  @Input()
  parentStep: Step;

  /** mostra o botão de remover etapa */
  @Input()
  showRemoveButton = true;

  /** mostra o botão de adicionar etapa filha */
  @Input()
  showAddChildButton = true;

  /** mostra o menu */
  @Input()
  isRootStep = true;

  @Input()
  maxDate: Moment;

  @Input()
  minDate: Moment;

  /** status possíveis */
  _possibleStatuses = Status;

  constructor(private _dialog: MatDialog) {
  }

  /** adiciona uma etapa filha */
  _addChild(step: Step) {
    if (!step.steps) {
      step.steps = [];
    }

    const dialogRef = this._dialog.open(NewStepTemplateDialogComponent, { data: { isRootStep: this.isRootStep, minDate: this.minDate, maxDate: this.maxDate, } });

    dialogRef.afterClosed().subscribe((value: { name: string, startDate: Moment; endDate: Moment } | null) => {
      if (value !== null) {
        step.steps.push({ ...value, steps: [] });
      }
    })
  }

  /** remove uma etapa */
  _remove(step: Step, parentStep: Step) {
    console.log({ step, parentStep })
    if (!parentStep || !parentStep.steps) {
      return;
    }

    const index = parentStep.steps.indexOf(step);

    if (index < 0) {
      return;
    }

    parentStep.steps.splice(index, 1);
  }

  _edit(step: Step) {
    this._dialog.open(NewStepTemplateDialogComponent, { data: { step, isRootStep: this.isRootStep, maxDate: this.maxDate, minDate: this.minDate } });
  }

  /** conclui atividade */
  _markAsFinished(step: Step) {
    step.status = Status.FINISHED;

    if (!!step.steps) {
      step.steps.forEach((s: Step) => s.status = Status.FINISHED);
    }

    this._updateStatus();
  }

  /** obtém as classes para estilizar o expansion */
  get _expansionClass(): any {
    return {
      'saga-step-template-container-expansion': true,
      'saga-step-template-container-expansion-not-started': this.step.status === Status.NOT_STARTED,
      'saga-step-template-container-expansion-in-progress': this.step.status === Status.IN_PROGRESS,
      'saga-step-template-container-expansion-delayed': this.step.status === Status.OVERDUE,
      'saga-step-template-container-expansion-finished': this.step.status === Status.FINISHED

    }
  }

  /** atualiza status geral */
  private _updateStatus() {
    if (!this.step) {
      return;
    }

    const parentFinished = this.parentStep && this.parentStep.steps.length && this.parentStep.steps.every((s: Step) => s.status === Status.FINISHED);

    if (parentFinished) {
      this.parentStep.status = Status.FINISHED;
    }

    if (!this.step.steps) {
      return;
    }

    if (this.step.status === Status.FINISHED) {
      return;
    }

    const finished = this.step.steps.length && this.step.steps.every((s: Step) => s.status === Status.FINISHED);

    if (finished) {
      this.step.status = Status.FINISHED;
      return;
    }

    if (this.step.endDate && !this.step.endDate.isAfter(moment.utc())) {
      this.step.status = Status.OVERDUE;
      return;
    }

    if (this.step.startDate && !this.step.startDate.isAfter(moment.utc()) && this.step.endDate && this.step.endDate.isAfter(moment.utc())) {
      this.step.status = Status.IN_PROGRESS;
      return;
    }

    if (!this.step.startDate || this.step.startDate && this.step.startDate.isAfter(moment.utc())) {
      this.step.status = Status.NOT_STARTED;
      return;
    }
  }

  _buildTooltip(step: Step) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

    const startDate = step.startDate ? moment.utc(step.startDate).format('dd/MM/yyyy') : "-";

    const endDate = step.endDate ? moment.utc(step.endDate).format('dd/MM/yyyy') : "-";

    if (startDate === '-' && endDate === '-') {
      return 'Período não configurado';
    }

    return `${startDate} a ${endDate}`;
  }

}

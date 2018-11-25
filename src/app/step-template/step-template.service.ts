import { Injectable } from '@angular/core';

export enum Status {
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  FINISHED = 'FINISHED',
  OVERDUE = 'OVERDUE',
}

export interface User {
  name: string;
  email: string;
}

export interface Step {
  name: string;
  startDate?: Date;
  endDate?: Date;
  steps: Step[];
  status?: Status,
  assigned?: User[];
}

@Injectable({
  providedIn: 'root',
})
export class StepTemplateService {

  minMinDate(minRootDate: Date): Date {
    return minRootDate ? new Date(minRootDate) : null;
  }

  maxMaxDate(maxRootDate: Date): Date {
    return maxRootDate ? new Date(maxRootDate) : null;
  }

  maxMinDate(step: Step, maxRootDate: Date): Date {
    const minStepStartDate: Date = this._lookForMinimumStartDate(step, false);

    if((minStepStartDate && !maxRootDate) || (minStepStartDate && maxRootDate && minStepStartDate.getTime() < maxRootDate.getTime())) {
      return minStepStartDate
    }

    return maxRootDate;
  }

  minMaxDate(step: Step, minRootDate: Date): Date {
    const maxStepStartDate: Date = this._lookForMaximumStartDate(step, false);

    if((maxStepStartDate && !minRootDate) || (maxStepStartDate && minRootDate && maxStepStartDate.getTime() > minRootDate.getTime())) {
      return maxStepStartDate
    }

    return minRootDate;
  }

  private _lookForMinimumStartDate(step: Step, includeInitialStep = true) {
    if (!step) {
      return null;
    }

    let minDate: Date = null;
    if (includeInitialStep) {
      minDate = step.startDate ? new Date(step.startDate) : null;
    }

    if (!step.steps || !step.steps.length) {
      return minDate;
    }

    for (const s of step.steps) {
      const date = this._lookForMinimumStartDate(s);

      if ((date && !minDate) || (date && minDate && date.getTime() < minDate.getTime())) {
        minDate = date;
      }
    }

    return minDate;
  }

  private _lookForMaximumStartDate(step: Step, includeInitialStep = true) {
    if (!step) {
      return null;
    }

    let maxDate: Date = null;
    if (includeInitialStep) {
      maxDate = step.endDate ? new Date(step.endDate) : null;
    }

    if (!step.steps || !step.steps.length) {
      return maxDate;
    }

    for (const s of step.steps) {
      const date = this._lookForMaximumStartDate(s);

      if ((date && !maxDate) || (date && maxDate && date.getTime() >= maxDate.getTime())) {
        maxDate = date;
      }
    }

    return maxDate;
  }
}
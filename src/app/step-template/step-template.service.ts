import { Injectable } from '@angular/core';

import * as moment from 'moment';
type Moment = moment.Moment;

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
  startDate?: Moment;
  endDate?: Moment;
  steps: Step[];
  status?: Status,
  assigned?: User[];
}

@Injectable({
  providedIn: 'root',
})
export class StepTemplateService {

  minMinDate(minRootDate: Moment): Moment {
    return minRootDate ? moment.utc(minRootDate) : null;
  }

  maxMaxDate(maxRootDate: Moment): Moment {
    return maxRootDate ? moment.utc(maxRootDate) : null;
  }

  maxMinDate(step: Step, maxRootDate: Moment): Moment {
    const minStepStartDate: Moment = this._lookForMinimumStartDate(step, false);

    if ((minStepStartDate && !maxRootDate) || (minStepStartDate && maxRootDate && minStepStartDate.isBefore(maxRootDate))) {
      return minStepStartDate
    }

    return maxRootDate;
  }

  minMaxDate(step: Step, minRootDate: Moment): Moment {
    const maxStepStartDate: Moment = this._lookForMaximumStartDate(step, false);

    if ((maxStepStartDate && !minRootDate) || (maxStepStartDate && minRootDate && maxStepStartDate.isAfter(minRootDate))) {
      return maxStepStartDate
    }

    return minRootDate;
  }

  private _lookForMinimumStartDate(step: Step, includeInitialStep = true) {
    if (!step) {
      return null;
    }

    let minDate: Moment = null;
    if (includeInitialStep) {
      minDate = step.startDate ? moment.utc(step.startDate) : null;
    }

    if (!step.steps || !step.steps.length) {
      return minDate;
    }

    for (const s of step.steps) {
      const date = this._lookForMinimumStartDate(s);

      if ((date && !minDate) || (date && minDate && date.isBefore(minDate))) {
        minDate = date;
      }
    }

    return minDate;
  }

  private _lookForMaximumStartDate(step: Step, includeInitialStep = true) {
    if (!step) {
      return null;
    }

    let maxDate: Moment = null;
    if (includeInitialStep) {
      maxDate = step.endDate ? moment.utc(step.endDate) : null;
    }

    if (!step.steps || !step.steps.length) {
      return maxDate;
    }

    for (const s of step.steps) {
      const date = this._lookForMaximumStartDate(s);

      if ((date && !maxDate) || (date && maxDate && !date.isBefore(maxDate))) {
        maxDate = date;
      }
    }

    return maxDate;
  }
}
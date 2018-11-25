import { Injectable } from '@angular/core';

import { CdkDropList } from '@angular/cdk/drag-drop';

import { BehaviorSubject } from 'rxjs';

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

  private _list: CdkDropList[] = [];

  private _cdkPerStep = {};

  dropLists$: BehaviorSubject<CdkDropList[]> = new BehaviorSubject<CdkDropList[]>(this._list);

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

  addToCdkList(step: Step, dropList: CdkDropList) {
    if (this._list.some((cdkList: CdkDropList) => cdkList === dropList)) {
      return;
    }

    const key: string = this._sortString(JSON.stringify(step));
    if (!this._cdkPerStep[key]) {
      this._cdkPerStep[key] = dropList;
      this._list.push(dropList);
    }

    this.dropLists$.next([...this._list]);

    console.log(this._list.length);
  }

  removeFromList(step: Step) {
    const key: string = this._sortString(JSON.stringify(step));

    if(!this._cdkPerStep[key]) {
      return;
    }

    const index = this._list.findIndex((cdkList: CdkDropList) => cdkList === this._cdkPerStep[key]);

    if (index < 0) {
      return;
    }

    this._list.splice(index, 1);

    this.dropLists$.next([...this._list]);
  }

  /**
   * Ordena uma string
   *
   * @private
   * @param {string} str
   * @returns {string}
   * @memberof StepTemplateService
   */
  private _sortString(str: string): string {
    const strSplitted = str.split('').sort((a, b) => a.localeCompare(b, 'pt-br'));

    return strSplitted.reduce((acc, a) => acc = acc + a, '');
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
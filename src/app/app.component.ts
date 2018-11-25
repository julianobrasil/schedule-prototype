import { Component } from '@angular/core';

import { Step, User, Status } from './step-template/step-template.service';

import * as moment from 'moment';
type Moment = moment.Moment;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  users: { [key: string]: User } = {
    samuel: {
      name: 'Samuel',
      email: 'samuel@email.com',
    },
    juliano: {
      name: 'Juliano',
      email: 'juliano@email.com',
    },
    bruno: {
      name: 'Bruno',
      email: 'bruno@email.com',
    }
  }

  today: Moment = moment.utc();

  parentStep: Step =
    {
      name: 'Planejamento 2019-1',
      status: Status.IN_PROGRESS,
      startDate: this.buildNewDate(this.today, -30),
      endDate: this.buildNewDate(this.today, 90),
      steps: [
        {
          name: 'Disponibilidade',
          status: Status.IN_PROGRESS,
          startDate: this.buildNewDate(this.today, -30),
          endDate: this.buildNewDate(this.today, -15),
          steps: [
            {
              name: 'Engenharia Elétrica',
              status: Status.IN_PROGRESS,
              startDate: this.buildNewDate(this.today, -30),
              endDate: this.buildNewDate(this.today, -15),
              steps: [],
              assigned: [
                this.users.samuel,
                this.users.juliano,
              ]
            },
            {
              name: 'Arquitetura',
              status: Status.IN_PROGRESS,
              startDate: this.buildNewDate(this.today, -30),
              endDate: this.buildNewDate(this.today, -15),
              steps: [],
              assigned: [
                this.users.bruno,
              ]
            }
          ],
        },
        {
          name: 'Ratificação',
          status: Status.IN_PROGRESS,
          startDate: this.buildNewDate(this.today, -30),
          endDate: this.buildNewDate(this.today, 1),
          steps: [
            {
              name: 'Engenharia Elétrica',
              status: Status.IN_PROGRESS,
              startDate: this.buildNewDate(this.today, -30),
              endDate: this.buildNewDate(this.today, 1),
              steps: [],
              assigned: [
                this.users.samuel,
                this.users.juliano,
              ]
            },
            {
              name: 'Arquitetura',
              status: Status.IN_PROGRESS,
              startDate: this.buildNewDate(this.today, -30),
              endDate: this.buildNewDate(this.today, 1),
              steps: [],
              assigned: [
                this.users.bruno,
              ]
            }
          ],
        },
        {
          name: 'Horário',
          status: Status.NOT_STARTED,
          startDate: this.buildNewDate(this.today, 2),
          endDate: this.buildNewDate(this.today, 30),
          steps: [
            {
              name: 'Engenharia Elétrica',
              status: Status.NOT_STARTED,
              startDate: this.buildNewDate(this.today, 2),
              endDate: this.buildNewDate(this.today, 30),
              steps: [],
              assigned: [
                this.users.samuel,
                this.users.juliano,
              ]
            },
            {
              name: 'Arquitetura',
              status: Status.NOT_STARTED,
              startDate: this.buildNewDate(this.today, 2),
              endDate: this.buildNewDate(this.today, 30),
              steps: [],
              assigned: [
                this.users.bruno,
              ]
            }
          ],
        },
      ]
    };


  buildNewDate(date: Moment, days: number): Moment {
    const newDate = moment.utc(date);

    newDate.add(days, 'days');

    return newDate;
  }
}

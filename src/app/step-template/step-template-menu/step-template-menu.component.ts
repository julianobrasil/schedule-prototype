import { Component, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

import {Step} from '../step-template.component';

export interface StepToRemove {
  step: Step;
  parentStep: Step;
}

@Component({
  selector: 'app-step-template-menu',
  templateUrl: 'step-template-menu.component.html',
  styleUrls: ['step-template-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StepTemplateMenuComponent {
  @Input()
  step: Step;

  @Input()
  parentStep: Step;

  /** mostra o botão de remover etapa */
  @Input()
  showRemoveButton = true;

  /** mostra o botão de adicionar etapa filha */
  @Input()
  showAddChildButton = true;

  /** é o componente raiz */
  @Input()
  isRootStep = true;

  /** emite quando o botão de remover for clicado */
  @Output()
  remove: EventEmitter<StepToRemove> = new EventEmitter<StepToRemove>();

  /** emite quando o botão de adicionar for clicado */
  @Output()
  addChild: EventEmitter<Step> = new EventEmitter<Step>();

  /** emite quando o botão de alterar for clicado */
  @Output()
  edit: EventEmitter<Step> = new EventEmitter<Step>();

  /** emite quando o botão de alterar for clicado */
  @Output()
  markAsFinished: EventEmitter<Step> = new EventEmitter<Step>();
}
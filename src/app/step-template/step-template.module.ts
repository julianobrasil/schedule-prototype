import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';


import { StepTemplateComponent } from './step-template.component';
import { StepTemplateMenuComponent } from './step-template-menu/step-template-menu.component';
import { NewStepTemplateDialogComponent } from './new-step-template-dialog/new-step-template-dialog.component';

import {DemoMaterialModule} from '../material-module';

@NgModule({
  imports: [CommonModule,ReactiveFormsModule,DemoMaterialModule,],
  declarations: [StepTemplateComponent, NewStepTemplateDialogComponent, StepTemplateMenuComponent],
  exports:[StepTemplateComponent],
  entryComponents: [NewStepTemplateDialogComponent],
})
export class StepTemplateModule {}
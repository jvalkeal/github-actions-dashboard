import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ClrForm, ClrWizard } from '@clr/angular';
import { take, map } from 'rxjs/operators';
import { DispatchesService } from '../dispatches.service';
import { Dispatch, Team } from '../../api/api.service';
import { ChooseTeamComponent } from 'src/app/shared/choose-team/choose-team.component';

@Component({
  selector: 'app-modal-new-dispatch',
  templateUrl: './modal-new-dispatch.component.html',
  styleUrls: ['./modal-new-dispatch.component.css']
})
export class ModalNewDispatchComponent implements OnInit {

  show = false;
  name = '';
  type = '';
  payload = '';
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  private nameControl: FormControl;
  private typeControl: FormControl;
  private payloadControl: FormControl;

  @ViewChild(ClrForm)
  private clrForm: ClrForm;

  @ViewChild(ClrWizard)
  private wizard: ClrWizard;

  @ViewChild(ChooseTeamComponent, {static: true})
  private chooseTeam: ChooseTeamComponent;

  get selectedTeam(): Team {
    return this.chooseTeam?.selectedTeam;
  }

  constructor(
    private dispatchesService: DispatchesService
  ) { }

  ngOnInit(): void {
    this.nameControl = new FormControl(
      this.name,
      Validators.required,
      this.existingNameValidator(this.dispatchesService.userDispatches()));
    this.form1 = new FormGroup({
      name: this.nameControl
    });
    this.typeControl = new FormControl(this.type, Validators.required);
    this.form2 = new FormGroup({
      type: this.typeControl
    });
    this.payloadControl = new FormControl(this.payload, { asyncValidators: this.validJsonValidator() });
    this.form3 = new FormGroup({
      payload: this.payloadControl
    });
  }

  loadTeams(): void {
    this.chooseTeam.loadTeams();
  }

  open(): void {
    this.show = true;
    this.clrForm.markAsTouched();
  }

  doCancel(): void {
    this.reset();
  }

  doFinish(): void {
    this.dispatchesService.updateAction({
      name: this.name,
      team: this.chooseTeam?.selectedTeam?.combinedSlug,
      eventType: this.type,
      clientPayload: this.payload
    });
    this.reset();
  }

  private reset(): void {
    this.wizard.reset();
    this.nameControl.setValue('');
    this.typeControl.setValue('');
    this.payloadControl.setValue('');
  }

  private existingNameValidator(dispatches: Observable<Dispatch[]>): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (control.value === null || control.value === 0 || control.value === undefined) {
        // this validator only checks if value exists
        return of(null);
      } else {
        // check if given name is already in a state
        return dispatches.pipe(
          take(1),
          map(d => d.some(item => item.name === control.value) ? { duplicateName: control.value } : null)
        );
      }
    };
  }

  private validJsonValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (control.value === null || control.value === '') {
        return of(null);
      } else {
        try {
          JSON.parse(control.value);
          return of(null);
        } catch (error) {
          return of({ invalidJson: control.value });
        }
      }
    };
  }
}

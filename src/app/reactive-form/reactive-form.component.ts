import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Information } from '../model';

export function MustMatch(
  controlName: string,
  matchingControlName: string
): any {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    // set error on matchingControl if validation fails
    if (Number(control.value) >= Number(matchingControl.value)) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent implements OnInit {
  infoForm: FormGroup;
  information!: Information;
  isHidden: boolean = true;
  regexEmail = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}';

  years = Array(11)
    .fill(0)
    .map((i, idx) => {
      return idx + 1990;
    });

  months = Array(12)
    .fill(0)
    .map((i, idx) => {
      return idx + 1;
    });

  days = Array(31)
    .fill(0)
    .map((i, idx) => {
      return idx + 1;
    });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(/^[a-z ,.'-]+$/i),
          ],
        ],
        email: ['', [Validators.required, Validators.pattern(this.regexEmail)]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(10),
            Validators.maxLength(11),
          ],
        ],
        gender: '',
        skills: this.fb.group({
          html: true,
          css: false,
          javascript: false,
          jquery: false,
          angular: false,
          react: false,
        }),
        birthday: this.fb.group({
          day: ['1'],
          month: ['1'],
          year: ['1990'],
        }),
        education: this.fb.array([this.educationRow()]),
      },
      { validators: validateDate }
    );
  }

  onSubmit() {
    this.isHidden = false;
    this.information = this.infoForm.value;
  }

  // education
  educationRow() {
    return this.fb.group(
      {
        schoolName: ['', [Validators.minLength(10), Validators.maxLength(50)]],
        startYear: ['2020', [Validators.pattern('^[0-9]*$')]],
        endYear: ['2022', [Validators.pattern('^[0-9]*$')]],
      },
      { validators: MustMatch('startYear', 'endYear') }
    );
  }

  addEducationRow() {
    this.educationForm.push(this.educationRow());
  }

  deletedEducationRow(index: number) {
    (this.infoForm.get('education') as FormArray).removeAt(index);
  }

  handleEducation(i: number) {
    return (this.infoForm.get('education') as FormArray).at(i) as FormGroup;
  }

  get form(): any {
    return this.infoForm.controls;
  }
  get educationForm() {
    return (this.infoForm.get('education') as FormArray).controls;
  }
}

// custom validate
const validateDate: ValidatorFn = (controls: AbstractControl) => {
  const day = controls.get('birthday.day')?.value;
  const month = controls.get('birthday.month')?.value;
  const year = controls.get('birthday.year')?.value;

  switch (month) {
    case '4':
    case '6':
    case '9':
    case '11':
      if (day === '31') return { invalidDate: true };
      break;
    case '2':
      if (['30', '31'].includes(day)) return { invalidDate: true };
      if (year % 4 !== 0) {
        return day === '29' ? { invalidDate: true } : null;
      }
      break;
    default:
      break;
  }
  return null;
};

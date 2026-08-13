import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-forms',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TextFieldModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
})
export class Forms {
  private readonly fb = new FormBuilder();

  protected readonly roles = ['RN', 'PCT', 'Charge Nurse', 'Unit Coordinator', 'Administrator'];

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    contactMethod: ['email', Validators.required],
    startDate: this.fb.control<Date | null>(null, Validators.required),
    notify: [true],
    notes: [''],
  });

  protected readonly submitted = signal(false);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.set(true);
  }

  protected reset(): void {
    this.form.reset({ contactMethod: 'email', notify: true });
    this.submitted.set(false);
  }
}

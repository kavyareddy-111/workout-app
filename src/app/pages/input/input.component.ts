import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Workout {
  type: string;
  minutes: number;
}

interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  workoutForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: ['', Validators.required],
      workoutMinutes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.workoutForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.workoutForm.markAllAsTouched();
      return;
    }

    const newData = this.workoutForm.value;
    const existingData = localStorage.getItem('workoutData');
    
    let data: User[] = existingData ? JSON.parse(existingData) : [];

    // Find the index of the user in the data array
    const userIndex = data.findIndex(user => user.name === newData.userName);

    if (userIndex > -1) {
      // User exists, update their workouts
      data[userIndex].workouts.push({
        type: newData.workoutType,
        minutes: newData.workoutMinutes
      });
    } else {
      // User does not exist, add a new entry
      data.push({
        id: data.length > 0 ? data[data.length - 1].id + 1 : 1,  // Incremental ID
        name: newData.userName,
        workouts: [
          { type: newData.workoutType, minutes: newData.workoutMinutes }
        ]
      });
    }

    try {
      // Save updated data to local storage
      localStorage.setItem('workoutData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save workout data:', error);
    }

    // Navigate to another page after submission
    this.router.navigate(['/page2']);
  }
}

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Workout {
  type: string;
  minutes: number;
}

interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

interface WorkoutData {
  name: string;
  workouts: Workout[]; // Array of workout objects
  numberOfWorkouts: number;
  totalWorkoutMinutes: number;
}

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit {
  workoutData: WorkoutData[] = [];
  searchTerm: string = '';
  selectedWorkoutType: string = 'All';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  paginatedWorkoutData: WorkoutData[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedData = localStorage.getItem('workoutData');

      if (storedData) {
        try {
          const data: User[] = JSON.parse(storedData);
          if (Array.isArray(data)) {
            this.workoutData = data.map(user => ({
              name: user.name,
              workouts: user.workouts,
              numberOfWorkouts: user.workouts.length,
              totalWorkoutMinutes: user.workouts.reduce(
                (sum: number, workout: Workout) => sum + workout.minutes,
                0
              )
            }));
          } else {
            this.workoutData = [];
          }
        } catch (e) {
          console.error('Failed to parse workout data from local storage:', e);
          this.workoutData = [];
        }
      } else {
        console.log('No workout data found in local storage');
      }

      this.applyFilters();
    } else {
      console.log('Not running in a browser environment');
    }
  }

  applyFilters(): void {
    let filteredData = this.workoutData;

    // Apply search filter
    if (this.searchTerm) {
      filteredData = filteredData.filter(w =>
        w.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply workout type filter
    if (this.selectedWorkoutType !== 'All') {
      filteredData = filteredData.filter(w =>
        w.workouts.some(workout => workout.type === this.selectedWorkoutType)
      );
    }

    // Paginate the filtered data
    this.paginateData(filteredData);
  }

  paginateData(data: WorkoutData[]): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedWorkoutData = data.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to the first page on search change
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to the first page on filter change
    this.applyFilters();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  get filteredData(): WorkoutData[] {
    // Apply search and filter logic to get the filtered data
    let filteredData = this.workoutData;

    // Apply search filter
    if (this.searchTerm) {
      filteredData = filteredData.filter(w =>
        w.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply workout type filter
    if (this.selectedWorkoutType !== 'All') {
      filteredData = filteredData.filter(w =>
        w.workouts.some(workout => workout.type === this.selectedWorkoutType)
      );
    }

    return filteredData;
  }
}

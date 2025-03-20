import { Routes } from '@angular/router';
import { ParticipantFormComponent } from './components/participant-form/participant-form.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: 'participants', pathMatch: 'full' },
  { path: 'participants', component: ParticipantFormComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: 'participants' }
];

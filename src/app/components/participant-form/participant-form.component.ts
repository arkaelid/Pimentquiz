import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participant-form.component.html',
  styleUrl: './participant-form.component.scss'
})
export class ParticipantFormComponent {
  participants: string[] = [''];
  errorMessage = '';

  constructor(private quizService: QuizService, private router: Router) {}

  trackByFn(index: number): number {
    return index;
  }

  addParticipant(): void {
    this.participants.push('');
  }

  removeParticipant(index: number): void {
    if (this.participants.length > 1) {
      this.participants.splice(index, 1);
    }
  }

  startQuiz(): void {
    // Filtrer les participants vides
    const validParticipants = this.participants
      .map(name => name.trim())
      .filter(name => name);

    if (validParticipants.length === 0) {
      this.errorMessage = 'Veuillez saisir au moins un participant valide';
      return;
    }
    
    this.quizService.addParticipants(validParticipants);
    this.quizService.setQuestions(this.quizService.getDefaultQuestions());
    this.router.navigate(['/quiz']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Participant } from '../../models/participant';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  participants: Participant[] = [];
  topThree: Participant[] = [];
  otherParticipants: Participant[] = [];

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    // Obtenir les participants triés par score
    this.participants = this.quizService.getParticipantsByScore();
    
    if (this.participants.length === 0) {
      this.router.navigate(['/participants']);
      return;
    }
    
    // Obtenir le top 3
    this.topThree = this.participants.slice(0, 3);
    
    // Obtenir les autres participants
    this.otherParticipants = this.participants.slice(3);
  }

  restartQuiz(): void {
    this.quizService.resetQuiz();
  }
  
  // Méthodes pour le thème piment
  getScoreArray(score: number): number[] {
    return Array(Math.min(score, 4)).fill(0);
  }
  
  getHeatClass(score: number): string {
    if (score === 0) return '';
    if (score <= 1) return 'mild';
    if (score <= 2) return 'medium';
    if (score <= 3) return 'hot';
    return 'extra-hot';
  }
  
  getHeatLevel(score: number): string {
    if (score === 0) return 'Sans piquant';
    if (score <= 1) return 'Piment Doux';
    if (score <= 2) return 'Piment Moyen';
    if (score <= 3) return 'Piment Fort';
    return 'Piment Extra-Fort';
  }
}

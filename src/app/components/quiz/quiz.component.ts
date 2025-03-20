import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Question } from '../../models/question';
import { Participant } from '../../models/participant';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  currentQuestion: Question | null = null;
  currentQuestionIndex: number = 0;
  questions: Question[] = [];
  participants: Participant[] = [];
  selectedParticipantId: number | null = null;
  isAnswerRevealed: boolean = false;
  isAnimating: boolean = false;
  isHintRevealed: boolean = false;
  
  constructor(private quizService: QuizService, private router: Router) {}
  
  ngOnInit(): void {
    // Vérifier s'il y a des participants
    this.quizService.participants$.subscribe(participants => {
      this.participants = participants;
      if (participants.length === 0) {
        this.router.navigate(['/participants']);
      }
    });
    
    // Obtenir les questions
    this.quizService.questions$.subscribe(questions => {
      this.questions = questions;
      if (questions.length === 0) {
        this.router.navigate(['/participants']);
      }
    });
    
    // Obtenir l'index de la question actuelle
    this.quizService.currentQuestionIndex$.subscribe(index => {
      this.currentQuestionIndex = index;
      if (this.questions.length > 0) {
        this.currentQuestion = this.questions[index];
        // Réinitialiser l'état d'affichage de la réponse et la sélection du participant
        this.isAnswerRevealed = false;
        this.isHintRevealed = false;
        this.selectedParticipantId = null;
      }
    });
  }
  
  // Obtenir le libellé de difficulté en fonction du niveau
  getDifficultyLabel(difficulty: number): string {
    switch(difficulty) {
      case 1:
        return '🌶️ Facile';
      case 2:
        return '🌶️🌶️ Moyen';
      case 3:
        return '🌶️🌶️🌶️ Épicé';
      case 4:
        return '🌶️🌶️🌶️🌶️ Brûlant !';
      default:
        return '🌶️ Facile';
    }
  }
  
  // Créer un tableau pour afficher les points de difficulté
  getDifficultyArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
  
  // Obtenir le texte à afficher pour les points
  getPointsText(difficulty: number): string {
    return `${difficulty} point${difficulty > 1 ? 's' : ''}`;
  }
  
  // Révéler l'indice (choix multiples)
  toggleHintReveal(): void {
    this.isHintRevealed = true;
  }
  
  // Mélanger les choix possibles
  getShuffledChoices(): string[] {
    if (!this.currentQuestion) return [];
    return [...this.currentQuestion.choices].sort(() => Math.random() - 0.5);
  }
  
  selectParticipant(participantId: number): void {
    // Ne permet la sélection que si la réponse a été révélée
    if (this.isAnswerRevealed) {
      this.selectedParticipantId = participantId;
    }
  }
  
  toggleAnswerReveal(): void {
    this.isAnswerRevealed = true;
  }
  
  nextQuestion(): void {
    // Si déjà en animation, ne pas déclencher une nouvelle transition
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Si un participant a été sélectionné (et ce n'est pas "Aucun vainqueur"), augmenter son score
    if (this.selectedParticipantId !== null && this.selectedParticipantId !== -1) {
      // Si l'indice a été utilisé, attribuer seulement 1 point, sinon utiliser la difficulté
      if (this.isHintRevealed) {
        this.quizService.incrementScoreWithHint(this.selectedParticipantId);
      } else {
        this.quizService.incrementScore(this.selectedParticipantId);
      }
    }
    
    // D'abord, faire défiler tout en haut de la page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Attendre un court délai pour que le scroll se termine avant de lancer l'animation
    setTimeout(() => {
      // Animer la disparition de la question actuelle
      document.querySelector('.container')?.classList.add('slide-up');
      
      // Attendre que l'animation de disparition soit terminée
      setTimeout(() => {
        // Réinitialiser la sélection du participant et l'affichage de la réponse
        this.selectedParticipantId = null;
        this.isAnswerRevealed = false;
        this.isHintRevealed = false;
        
        // Passer à la question suivante
        this.quizService.nextQuestion();
        
        // Retirer la classe d'animation de disparition
        document.querySelector('.container')?.classList.remove('slide-up');
        // Ajouter la classe d'animation d'apparition
        document.querySelector('.container')?.classList.add('slide-down');
        
        // Attendre que l'animation d'apparition soit terminée
        setTimeout(() => {
          document.querySelector('.container')?.classList.remove('slide-down');
          this.isAnimating = false;
        }, 600);
      }, 600);
    }, 300); // Délai pour le scroll
  }
  
  getQuestionNumber(): string {
    return `Question ${this.currentQuestionIndex + 1}/${this.questions.length}`;
  }
  
  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
  
  // Méthodes pour le score
  getHeatPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }
  
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
}

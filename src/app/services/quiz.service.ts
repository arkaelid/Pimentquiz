import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Participant } from '../models/participant';
import { Question } from '../models/question';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private participantsSubject = new BehaviorSubject<Participant[]>([]);
  private currentQuestionIndexSubject = new BehaviorSubject<number>(0);
  private questionsSubject = new BehaviorSubject<Question[]>([]);

  // Accès aux observables
  public participants$: Observable<Participant[]> = this.participantsSubject.asObservable();
  public currentQuestionIndex$: Observable<number> = this.currentQuestionIndexSubject.asObservable();
  public questions$: Observable<Question[]> = this.questionsSubject.asObservable();

  constructor(private router: Router) { }

  // Ajouter des participants
  addParticipants(names: string[]): void {
    const participants = names.map((name, index) => ({
      id: index + 1,
      name: name.trim(),
      score: 0
    }));
    this.participantsSubject.next(participants);
  }

  // Ajouter des questions
  setQuestions(questions: Question[]): void {
    // Trier les questions par difficulté croissante
    const sortedQuestions = [...questions].sort((a, b) => a.difficulty - b.difficulty);
    this.questionsSubject.next(sortedQuestions);
  }

  // Passer à la question suivante
  nextQuestion(): void {
    const currentIndex = this.currentQuestionIndexSubject.value;
    const questions = this.questionsSubject.value;
    
    if (currentIndex < questions.length - 1) {
      this.currentQuestionIndexSubject.next(currentIndex + 1);
    } else {
      // Quiz terminé, naviguer vers les résultats
      this.router.navigate(['/results']);
    }
  }

  // Augmenter le score d'un participant en fonction de la difficulté de la question
  incrementScore(participantId: number): void {
    const currentQuestionIndex = this.currentQuestionIndexSubject.value;
    const currentQuestion = this.questionsSubject.value[currentQuestionIndex];
    const difficulty = currentQuestion.difficulty;
    
    // Attribuer des points en fonction de la difficulté
    const pointsToAdd = difficulty;
    
    const participants = this.participantsSubject.value.map(p => {
      if (p.id === participantId) {
        return { ...p, score: p.score + pointsToAdd };
      }
      return p;
    });
    
    this.participantsSubject.next(participants);
  }

  // Augmenter le score d'un participant de 1 point seulement lorsque l'indice a été utilisé
  incrementScoreWithHint(participantId: number): void {
    // Attribuer 1 point seulement, indépendamment de la difficulté
    const participants = this.participantsSubject.value.map(p => {
      if (p.id === participantId) {
        return { ...p, score: p.score + 1 };
      }
      return p;
    });
    
    this.participantsSubject.next(participants);
  }

  // Obtenir les participants triés par score
  getParticipantsByScore(): Participant[] {
    return [...this.participantsSubject.value].sort((a, b) => b.score - a.score);
  }

  // Réinitialiser le quiz
  resetQuiz(): void {
    this.currentQuestionIndexSubject.next(0);
    this.participantsSubject.next([]);
    this.router.navigate(['/participants']);
  }

  // Questions sur le thème des piments
  getDefaultQuestions(): Question[] {
    return [
      { 
        id: 1, 
        text: 'Quel est le piment le plus fort du monde selon l\'échelle de Scoville?', 
        answer: 'Le Carolina Reaper',
        difficulty: 4,
        choices: [
          'Le Carolina Reaper',
          'Le Ghost Pepper',
          'Le Trinidad Scorpion',
          'Le Habanero'
        ]
      },
      { 
        id: 2, 
        text: 'Quelle substance donne leur piquant aux piments?', 
        answer: 'La capsaïcine',
        difficulty: 2,
        choices: [
          'La capsaïcine',
          'La pipérine',
          'L\'allicine',
          'La curcumine'
        ]
      },
      { 
        id: 3, 
        text: 'De quel continent sont originaires les piments?', 
        answer: 'L\'Amérique (Amérique du Sud)',
        difficulty: 1,
        choices: [
          'L\'Amérique (Amérique du Sud)',
          'L\'Asie',
          'L\'Afrique',
          'L\'Europe'
        ]
      },
      { 
        id: 4, 
        text: 'Quel pays est le plus grand producteur mondial de piments?', 
        answer: 'La Chine',
        difficulty: 3,
        choices: [
          'La Chine',
          'Le Mexique',
          'L\'Inde',
          'La Thaïlande'
        ]
      },
      { 
        id: 5, 
        text: 'Comment s\'appelle la sauce piquante originaire de Louisiane faite à partir de piments tabasco?', 
        answer: 'La sauce Tabasco',
        difficulty: 1,
        choices: [
          'La sauce Tabasco',
          'La sauce Sriracha',
          'La sauce Cholula',
          'La sauce Valentina'
        ]
      },
      { 
        id: 6, 
        text: 'Quelle partie du piment contient le plus de capsaïcine?', 
        answer: 'Les graines et les membranes intérieures (placenta)',
        difficulty: 3,
        choices: [
          'Les graines et les membranes intérieures (placenta)',
          'La peau extérieure',
          'La tige',
          'La pointe du piment'
        ]
      },
      { 
        id: 7, 
        text: 'Quel aliment peut soulager la sensation de brûlure après avoir mangé un piment fort?', 
        answer: 'Le lait (ou les produits laitiers)',
        difficulty: 2,
        choices: [
          'Le lait (ou les produits laitiers)',
          'L\'eau',
          'Les boissons gazeuses',
          'Le jus de citron'
        ]
      },
      { 
        id: 8, 
        text: 'Quelle est la couleur du piment jalapeño à maturité?', 
        answer: 'Rouge',
        difficulty: 1,
        choices: [
          'Rouge',
          'Vert',
          'Jaune',
          'Orange'
        ]
      },
      { 
        id: 9, 
        text: 'Dans quel plat mexicain traditionnel les piments poblano farcis sont-ils utilisés?', 
        answer: 'Les chiles en nogada',
        difficulty: 4,
        choices: [
          'Les chiles en nogada',
          'Le mole poblano',
          'Les tacos al pastor',
          'Les enchiladas'
        ]
      },
      { 
        id: 10, 
        text: 'Quel degré sur l\'échelle de Scoville atteint le piment habanero?', 
        answer: 'Entre 100 000 et 350 000 unités Scoville',
        difficulty: 4,
        choices: [
          'Entre 100 000 et 350 000 unités Scoville',
          'Entre 500 000 et 1 million d\'unités Scoville',
          'Entre 2 000 et 8 000 unités Scoville',
          'Entre 10 000 et 50 000 unités Scoville'
        ]
      }
    ];
  }
}

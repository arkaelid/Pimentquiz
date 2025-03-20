export interface Question {
  id: number;
  text: string;
  answer: string;
  difficulty: number; // Niveau de difficulté de 1 à 5
  choices: string[]; // Tableau contenant les choix possibles (incluant la bonne réponse)
}

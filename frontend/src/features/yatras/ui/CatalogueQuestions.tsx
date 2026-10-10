import { DIFFICULTIES, DIFFICULTY_INFO } from '../model/yatra';
import './CatalogueQuestions.css';

const QUESTIONS = [
  {
    id: 'price',
    question: 'What does the price cover?',
    answer:
      'Hotels on twin sharing, breakfast and dinner, and road transport for the route. Travel to the start city is not included. Each yatra page lists what is and is not covered in full.',
  },
  {
    id: 'booking',
    question: 'How do I book a seat?',
    answer:
      'Open a yatra, pick a departure and send a booking request with a phone number and the number of travellers. Your seats are held as soon as the request is sent, and our team phones you to confirm.',
  },
  {
    id: 'payment',
    question: 'Do I pay on this site?',
    answer:
      'No. Nothing is paid here. Payment is explained on the confirmation call after your request is received.',
  },
  {
    id: 'season',
    question: 'When do the Himalayan yatras run?',
    answer:
      'The Himalayan shrines open from May to October. Most other circuits run from October to March, and a few run all year. The month filter above shows what leaves in a given month.',
  },
  {
    id: 'full',
    question: 'What if the date I want is full?',
    answer:
      'A full departure is marked "Full" and cannot be requested. The yatra page lists every other date with the seats left on each.',
  },
] as const;

export function CatalogueQuestions() {
  return (
    <section className="questions" aria-labelledby="questions-title">
      <div className="page grid">
        <h2 id="questions-title" className="questions__title">
          Questions people ask
        </h2>

        <div className="questions__list">
          {QUESTIONS.map(({ id, question, answer }) => (
            <details key={id} className="questions__item" name="catalogue-questions">
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}

          <details className="questions__item" name="catalogue-questions">
            <summary>How much walking is there?</summary>
            <p>
              Each yatra states the distance on foot and the highest point reached, and is marked
              with one of three effort levels.
            </p>
            <dl className="questions__levels">
              {DIFFICULTIES.map((difficulty) => (
                <div key={difficulty}>
                  <dt>{DIFFICULTY_INFO[difficulty].label}</dt>
                  <dd>{DIFFICULTY_INFO[difficulty].meaning}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </div>
    </section>
  );
}

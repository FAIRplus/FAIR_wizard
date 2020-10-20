export const DECISION_TREE = {
  id: '0',
  question: 'Choose your destiny',
  answer: '',
  children: [
    {
      id: '1',
      question: 'How did they come to New York?',
      answer: 'Novice',
      children: [
        {
          id: '1_1',
          question: '',
          answer: 'Run',
          children: []
        }, {
          id: '1_2',
          question: '',
          answer: 'Give Up',
          children: []
        }, {
          id: '1_3',
          question: '',
          answer: 'Die',
          children: []
        }
      ]
    },
    {
      id: '2',
      question: 'How did they come to London',
      answer: 'Warrior',
      children: [
        {
          id: '2_1',
          question: '',
          answer: 'Fight and Die',
          children: []
        }, {
          id: '2_2',
          question: '',
          answer: 'Run',
          children: []
        }
      ]
    },
    {
      id: '3',
      question: '',
      answer: 'Master',
      children: []
    },
    {
      id: '4',
      question: '',
      answer: 'Champion',
      children: []
    },
    {
      id: '5',
      question: '',
      answer: 'Elder God',
      children: []
    }
  ]
};

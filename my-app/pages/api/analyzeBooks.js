import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeBooks = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { books } = req.body;

  if (!books || books.length === 0) {
    return res.status(400).json({ message: 'No books provided for analysis' });
  }

  try {
    console.log('Request received for book analysis:', books);

    const bookTitles = books.map(book => book.text).join(', ');

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `For each book in the following list, identify the author, provide a detailed summary, and match it to known information if available. Books: ${bookTitles}`
        }
      ],
    });

    const analysis = response.choices[0].message.content;

    console.log('Analysis result:', analysis);

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error analyzing books:', error);
    res.status(500).json({ message: 'Failed to analyze books' });
  }
};

export default analyzeBooks;

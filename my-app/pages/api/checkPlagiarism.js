// pages/api/checkPlagiarism.js
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import util from 'util';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = util.promisify(fs.readFile);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    let text = fields.text;

    if (files.file) {
      const filePath = files.file.path;
      const fileData = await readFile(filePath, 'utf8');
      text += `\n\n${fileData}`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Check the following text for plagiarism: ${text}` }],
      });

      const result = response.choices[0].message.content;

      res.status(200).json({ result });
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      res.status(500).json({ message: 'Failed to check plagiarism' });
    }
  });
};

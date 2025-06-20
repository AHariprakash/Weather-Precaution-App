const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection (updated for latest driver)
mongoose.connect('mongodb://localhost:27017/weatherAdvice')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Advice Schema
const AdviceSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Advice = mongoose.model('Advice', AdviceSchema);

// POST route to save advice
app.post('/api/advice', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Advice text is required' });
    }
    const newAdvice = new Advice({ text });
    await newAdvice.save();
    res.status(201).json({ message: '✅ Advice saved successfully' });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to save advice' });
  }
});

// Optionally: GET route to fetch all advice (for future use)
app.get('/api/advice', async (req, res) => {
  try {
    const advices = await Advice.find().sort({ date: -1 });
    res.json(advices);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch advice' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

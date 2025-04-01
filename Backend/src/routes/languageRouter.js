const express = require('express');
const router = express.Router();
const Language = require('../models/Language');
const mongoose = require('mongoose');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { languageId, name } = req.body;
    if (!languageId || !name) {
      return res.status(400).json({ error: 'languageId and name are required' });
    }

    const newLang = new Language({ languageId, name });
    await newLang.save();
    res.status(201).json(newLang);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const lang = await Language.findById(req.params.id);
    if (!lang) return res.status(404).json({ message: 'Language not found' });
    res.json(lang);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Language not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Language.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Language not found' });
    res.json({ message: 'Language deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

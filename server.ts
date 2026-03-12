import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Admin Client
const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '')?.replace(/^["']|["']$/g, '');
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '')?.replace(/^["']|["']$/g, '');

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase Admin credentials in environment variables.');
}

const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey || 'placeholder-key');

// GET Profile Route
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, full_name')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: data });
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/marketplace/new
app.post('/api/marketplace/new', async (req, res) => {
  const { seller_id, title, description, price, image, location } = req.body;

  if (!seller_id || !title || !price || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('marketplace_items')
      .insert([{ seller_id, title, description, price, image, location }])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'Item created successfully', item: data[0] });
  } catch (error: any) {
    console.error('Error creating marketplace item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/marketplace/:location
app.get('/api/marketplace/:location', async (req, res) => {
  const { location } = req.params;

  try {
    // We use a left join to get the seller's full_name from the users table
    const { data, error } = await supabaseAdmin
      .from('marketplace_items')
      .select(`
        *,
        users:seller_id (full_name)
      `)
      .ilike('location', `%${location}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ items: data });
  } catch (error: any) {
    console.error('Error fetching marketplace items:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/community/new
app.post('/api/community/new', async (req, res) => {
  const { user_id, content, type, tags } = req.body;

  if (!user_id || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .insert([{ user_id, content, type: type || 'text', tags: tags || [] }])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'Post created successfully', post: data[0] });
  } catch (error: any) {
    console.error('Error creating community post:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/community
app.get('/api/community', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .select(`
        *,
        users:user_id (full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    res.json({ posts: data });
  } catch (error: any) {
    console.error('Error fetching community posts:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

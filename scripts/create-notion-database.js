#!/usr/bin/env node

/**
 * Create a Notion database for Friday waitlist signups
 * 
 * Usage:
 *   node scripts/create-notion-database.js <parent_page_id>
 * 
 * The parent_page_id is the ID of the page where you want to create the database.
 * You can get it from the page URL: https://notion.so/<workspace>/<PAGE_ID>?v=...
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load API key from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const notionKeyMatch = envContent.match(/NOTION_API_KEY=(.+)/);

if (!notionKeyMatch) {
  console.error('❌ NOTION_API_KEY not found in .env.local');
  process.exit(1);
}

const NOTION_API_KEY = notionKeyMatch[1].trim();

// Get parent page ID from command line
const parentPageId = process.argv[2];

if (!parentPageId) {
  console.error('❌ Usage: node create-notion-database.js <parent_page_id>');
  console.error('   Get the page ID from the URL: https://notion.so/<workspace>/<PAGE_ID>');
  process.exit(1);
}

// Create database schema
const payload = JSON.stringify({
  parent: { page_id: parentPageId },
  title: [{ text: { content: 'Friday Waitlist' } }],
  properties: {
    'Email': {
      title: {}
    },
    'Signed Up': {
      date: {}
    },
    'Source': {
      select: {
        options: [
          { name: 'website', color: 'blue' },
          { name: 'referral', color: 'green' },
          { name: 'social', color: 'purple' }
        ]
      }
    },
    'Status': {
      select: {
        options: [
          { name: 'waitlist', color: 'yellow' },
          { name: 'contacted', color: 'orange' },
          { name: 'converted', color: 'green' }
        ]
      }
    },
    'Notes': {
      rich_text: {}
    }
  }
});

const options = {
  hostname: 'api.notion.com',
  path: '/v1/databases',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2025-09-03',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('🔨 Creating Notion database...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const response = JSON.parse(data);

    if (res.statusCode === 200) {
      console.log('\n✅ Database created successfully!');
      console.log('\n📋 Database Details:');
      console.log(`   Title: ${response.title[0].plain_text}`);
      console.log(`   ID: ${response.id}`);
      console.log(`   URL: ${response.url}`);
      
      console.log('\n🔧 Next Steps:');
      console.log('1. Add this to your Vercel environment variables:');
      console.log(`   NOTION_DATABASE_ID=${response.id}`);
      console.log('\n2. Update your .env.local:');
      console.log(`   NOTION_DATABASE_ID=${response.id}`);
      console.log('\n3. Share the database with your integration if needed.');
      
    } else {
      console.error('❌ Error creating database:');
      console.error(JSON.stringify(response, null, 2));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(payload);
req.end();

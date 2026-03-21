# Soul Link

Soul Link is a full-stack social media application built with React, TypeScript, Node.js, Express, and PostgreSQL.

It features a persona-based identity system, social posting, relationship mechanics, and messaging — all backed by a relational database.

## Features

- Persona-based identity system
- Moments (social posts)
- Soul Links (custom relationship system)
- Conversations and messaging
- Persistent PostgreSQL database
- Seeded demo data

## Tech Stack

Frontend:
- React
- TypeScript

Backend:
- Node.js
- Express

Database:
- PostgreSQL
- pg (node-postgres)

## API Routes

Personas:
- GET /api/personas
- POST /api/personas

Moments:
- GET /api/moments
- POST /api/moments

Soul Links:
- GET /api/soul-links
- POST /api/soul-links
- PATCH /api/soul-links/:id/accept

Conversations:
- GET /api/conversations
- POST /api/conversations

Messages:
- GET /api/messages/conversation/:id
- POST /api/messages

## Database Design

The app uses a relational schema with:

- personas
- moments
- soul_links
- conversations
- messages

Key decisions:
- Foreign key relationships between entities
- Unique indexes to prevent duplicate relationships
- Check constraints for valid states
- Timestamps for sorting and activity

## Local Setup

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/soul-link.git  
cd soul-link

2. Backend setup

cd backend  
npm install

3. Database setup

Make sure PostgreSQL is running and create the database if needed:

CREATE DATABASE soul_link;

4. Run schema

psql -U postgres -d soul_link -f schema.sql

5. Create environment variables

Create a `.env` file inside `/backend`:

PORT=4000  
PGHOST=localhost  
PGPORT=5432  
PGDATABASE=soul_link  
PGUSER=postgres  
PGPASSWORD=your_password  

6. Start backend

npm run dev

7. Seed demo data

npm run seed

## What I Built

- Full-stack architecture (React + Express + PostgreSQL)
- REST API design
- Relational database modeling
- SQL integration using pg
- Data integrity with constraints and indexes
- Seeded development environment

## Notes

- Conversations are stored as unique persona pairs
- Messaging updates conversation state (last message + timestamp)
- Database prevents duplicate relationships

## Future Improvements

- Authentication (JWT)
- Real-time messaging
- Pagination and filtering
- Deployment
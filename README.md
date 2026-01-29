# PokeBattler

A Pokémon battle game where you pick your fighter, spam the attack button, and hope RNG is on your side.

## Live Site

**[Play PokeBattler](https://pokebattler.netlify.app/)**

_Note: The backend is hosted on Render's free tier, so the first load might take ~30 seconds while Pikachu wakes up the server._

## Video Showcase

![Video Showcase](./Frontend/src/assets/videos/pokebattle.avif)

## Tech Stack

**Frontend:** React 19, Tailwind CSS 4, DaisyUI 5, Vite  
**Backend:** Node.js, Express 5  
**Deployed:** Netlify (frontend) + Render (backend)

## Running Locally

```sh
# Backend
cd Backend
bun install
bun run dev

# Frontend
cd Frontend
bun install
bun run dev
```

## Project Structure

```txt
Backend/
├── controllers/   # Handles the requests
├── routes/        # API endpoints
├── models/        # Data stuff
└── app.js         # Express server

Frontend/
├── pages/         # Login, Arena, Battle, Pokedex
├── components/    # Pokemon cards, images
└── context/       # Global state (who's fighting who)
```

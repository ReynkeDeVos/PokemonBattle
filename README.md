# PokeBattler

A Pokémon battle game where you pick your fighter, spam the attack button, and hope RNG is on your side.

## Live Site

**[Play PokeBattler](https://pokebattler.netlify.app/)**

_Note: The backend is hosted on Render's free tier, so the first load might take ~30 seconds while Pikachu wakes up the server._

## Video Showcase

![Video Showcase](./Frontend/src/assets/videos/pokebattle.avif)

## Tech Stack

**Frontend:** React 19, React Router 8, Tailwind CSS 4, DaisyUI 5, Vite 8  
**Backend:** Node.js, Express 5  
**Deployed:** Netlify (frontend) + Render (backend)

## Running Locally

```sh
# Backend
cd Backend
pnpm install
pnpm dev

# Frontend
cd Frontend
pnpm install
pnpm dev
```

The frontend talks to the deployed backend by default. To use your local one, start it with `VITE_API_URL=http://localhost:3000 pnpm dev`.

## Project Structure

```txt
Backend/
└── app.js             # Express server + /pokemon route, loads the roster from PokéAPI

Frontend/src/
├── pages/             # Login, Arena, Battle, Pokedex
├── components/        # Stadium screen, Pokemon card + retro UI bits
├── App.jsx            # Routes + global state (who's fighting who)
└── pokemon.js         # Sprite URLs, random picks
```

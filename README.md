# SWMS — Smart Water Management System

A modern, TypeScript-based web application to visualize, monitor, and manage water supply data and user complaints. Built with Next.js (app router), MapLibre for maps, and a component-driven UI. This repository contains a frontend app, sample datasets, and tools for seeding/setting up a complaint system.

## Table of contents
- [Demo / Screenshots](#demo--screenshots)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Install](#install)
  - [Environment variables](#environment-variables)
  - [Run](#run)
- [Realtime (live) features](#realtime-live-features)
- [Data & tools](#data--tools)
- [Project structure](#project-structure)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Demo / Screenshots
(Add screenshots or a short demo GIF here — put images in `/public` and reference them.)

## Features
- Interactive map visualization of water supply coverage (MapLibre)
- Live charts and dashboards for consumption/availability (Recharts)
- Complaint management utilities (scripts to install and seed complaints)
- Component-first UI using Radix + Tailwind + reusable components
- Client-side forms with react-hook-form + zod validation
- Mobile-friendly and theme-aware (next-themes)

## Tech stack
- Next.js (app router) + React (TypeScript)
- MapLibre GL for maps
- Tailwind CSS (+ animations)
- Radix UI primitives
- Recharts, date-fns for visualization and date handling
- react-hook-form + zod for forms and validation
- Tooling: PNPM/NPM, TypeScript, ESLint

## Getting started

### Requirements
- Node.js 18+ (or current LTS)
- pnpm (recommended) or npm/yarn
- Optional: a tile provider API key if you want high-quality map tiles (e.g., MapTiler or Mapbox), and backend/database if running complaint ingestion.

### Install
Clone the repository and install dependencies:

```bash
git clone https://github.com/ThakurAmanKumar/SWMS-SmartWaterManagementSystem.git
cd SWMS-SmartWaterManagementSystem
# using pnpm (recommended, repo contains pnpm-lock.yaml)
pnpm install
# or npm
# npm install

# Wrenchmark

## Overview

**Wrenchmark** is a motorcycle reference and restoration app built to help riders, hobbyist mechanics, and vintage bike lovers access detailed specs, brand histories, manuals, glossaries, and learning tools. This is a personal portfolio project, designed to demonstrate clean UI/UX design, modern frontend development, and structured content architecture.

## Features

- Motorcycle Specs Database – Searchable entries by brand, model, year, and configuration.
- Service & Owner Manuals – Downloadable PDFs linked by model, with support for placeholder entries on upload.
- Glossary & Guides – Interactive glossary of parts, systems, slang, and safety terms.
- Learning Center – Repair and riding skill lessons, safety modules, and course-style materials.
- Brand Histories & Timelines – Explore the evolution of motorcycle companies with interactive timelines.
- Modular Build Data – Support for shared components like engines, brakes, suspensions, and frames across models.
- Teal-smoke styling – Clean, high-contrast interface with subtle smoky gradients and teal/silver accents.

## Tech Stack

- **Frontend:** React (with Tailwind CSS, Headless UI, Heroicons)
- **Styling:** Tailwind CSS with custom theming (teal/silver/dark gradient scheme)
- **Backend:** Supabase (PostgreSQL with RLS)
- **Storage:** Supabase Buckets for manuals and PDFs
- **Deployment:** Vercel (or optional local deployment)

## Getting Started

### Prerequisites

- Node.js v18+
- Supabase project + credentials (for data + storage)
- Git

### Installation

```bash
git clone https://github.com/yourusername/wrenchmark.git
cd wrenchmark
npm install

# Madestays Owner Dashboard


Link: https://onboarding-dashboard-steel.vercel.app/


![dashboard screenshot](/public/screenshot.png "Dashboard view")



A property onboarding dashboard for Madestays owners to track the progress of each property through the onboarding process.


## Overview

This dashboard lets property owners onboard their properties to Madestay. Owners can see at a glance how many properties need attention, and for each property view status of individual steps.


## Features

- Property cards with onboarding status at a glance
- Per-property details step status in a modal
- Filter by status (Live, Needs attention, In progress, Not started)
- Search by property name
- Skeleton loading state


## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router)
- TypeScript
- CSS Modules
- Hosted on [Vercel](https://vercel.com/)


## Deployment

This project is deployed on Vercel. Pushes to `main` trigger automatic deployments.

Live url: [https://onboarding-dashboard-steel.vercel.app/](https://onboarding-dashboard-steel.vercel.app/)


## Getting started

### Prerequisites

- Node.js 18 or later
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```


## Project structure

```
src/
  app/               # Next.js App Router pages and layout
  components/        # UI components (PropertyCard, StepsModal, etc.)
  lib/
    types.ts         # Raw and UI type definitions
    onboarding.ts    # Data normalisation and derived status logic
public/
  onboarding-data.json   # Mock onboarding data
```


## Data

The data comes from onboarding-json provided which is placed in /public. Ideally these would come from a real backend, and could be different endpoints. To simulate backend loading, I've added a delay of 1s.


## Design decisions

Architecture wise: 
* The logic lives in /lib, and presentation components are in /components
* I've transformed (normalised) the raw data received since the data is sometimes messy, and so we can show a clean interface for the user

Data model:
* Property status is derived from indivdiual step statuses, since there is no proprerty status in the data.
* I've filled in missing steps as not-started, so all properties have a consistent steps list.

Handling real/messy data:
* Missing or broken images show as "photography pending" so UI doesn't look broken for user
* on_hold step status is treated as needs attention, since it wasn't docuemnted and that seemed like the closest.
* Long property names are clamped to two lines so cards look consistent
* I've tried to put in fallback values for invalid values like unknown status
* Empty state shows a message to the user so they aren't confused

User experience:
* I've opted to go with a modal for detail view so it is visiable at a glance, and everything else is still in context
* Property status is also visible at a glance with the colored badges
* I've used madestay.com as inspiration for the luxury aesthetic and color palette of the dashboard, so the brand design is consistent


## Improvements

Given more time, I'd think about these things:
1. I would add a progress bar and an actions section so owner can see what actions are needed from them without searching
2. Make the website more accessible by using buttons and aria labels
3. Add unit tests so the functionality is always testable
4. Move the data loading to a hook or next server component and use caching
5. Add some more polish and add actions in error state
6. Test and ensure it is mobile friendly
7. Open to more suggestions!
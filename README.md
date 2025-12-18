# 🧠 Child Source Monitoring & Online Credibility Research Platform

**Active Research Infrastructure – Kim Roberts Lab (Child Memory Lab / BrainWorX)**  
Wilfrid Laurier University

---

## Overview

This repository contains the full research infrastructure, tooling, and experimental website system used in an **active cognitive neuroscience and developmental psychology study** conducted in **Dr. Kim Roberts’ Child Memory Lab** at Wilfrid Laurier University.

The project investigates **children’s source monitoring, online credibility evaluation, and memory formation** when interacting with real-world web content of varying credibility levels. The system is currently deployed in **ongoing child memory research**, supporting experimental manipulation, behavioral data collection, and eye-tracking analysis.

This is not a mock or demo project.  
This codebase supports **live studies with children**, adheres to **research ethics constraints**, and was designed for **long-term reproducibility by future research assistants**.

---

## Research Context

- **Lab:** Child Memory Lab / BrainWorX  
- **Principal Investigator:** Dr. Kim Roberts  
- **Institution:** Wilfrid Laurier University  
- **Population:** Children (approx. ages 8–12)  
- **Research Focus:**
  - Source monitoring in children  
  - Online credibility judgment  
  - Memory accuracy and misinformation  
  - Attention allocation and visual scanning behavior  

The system integrates **experimental website manipulation**, **lesson-based credibility instruction**, and **eye-tracking data collection** to study how children evaluate and remember online information.

---

## Core Research Problem

Children increasingly encounter information online, yet:

- They struggle to distinguish **credible vs. non-credible sources**
- Superficial cues (layout, images, confidence) often override factual indicators
- Traditional lab tasks lack **ecological validity**

This project addresses these limitations by:

- Using **real downloaded websites**, not synthetic stimuli
- Systematically manipulating **credibility signals** at the HTML/CSS level
- Capturing **behavioral and attentional data** during naturalistic navigation
- Using a custom-built automated webscraper, with Selenium, BeautifulSoup, and PlayWright

---

## System Architecture

### 1. Website Credibility Manipulation


Real websites are downloaded and altered to create **three controlled credibility tiers**:

- **High credibility**
- **Medium credibility**
- **Low credibility**

Manipulations are grounded in a predefined **credibility criteria table**, including:

- Spelling and grammar quality  
- Presence or absence of references  
- Publication date visibility  
- Author identity and credentials  
- Advertisements  
- Image quality  
- Readability and layout professionalism  

Each website contains:

- Purposefully poorly done design

- Controlled internal navigation
- Identical informational content across credibility levels

This ensures **experimental control while preserving realism**.

---

### 2. Lesson-Based Experimental Design

The platform supports a **multi-phase study design**:

#### Pre-Test
- Children evaluate multiple websites (high / medium / low credibility)
- No instruction is provided

#### Lesson 1
Focuses on:
- Spelling and grammar
- Publication date
- References
- Useful information indicators

#### Lesson 2
Adds:
- Images and visual persuasion
- Advertisements
- Readability
- Author identity and credentials

Each lesson uses **modified websites aligned with the credibility criteria**.

---

### 3. Incoming implementations: Eye-Tracking Integration

The study integrates **Tobii eye-tracking software** to capture:

- Gaze duration
- Fixation points
- Visual heatmaps
- Attention to credibility cues (e.g., ads, author names, dates)

Raw outputs are exported as **CSV files** and later processed for:

- Heatmap generation
- Region-of-interest (ROI) analysis
- Time-based attention metrics



---

## Data Handling & Ethics

- No identifiable child data is stored in this repository
- All study procedures operate under **REB approval**
- Eye-tracking data is anonymized at collection
- Websites are hosted locally or offline during experiments

This repository intentionally **excludes raw participant data**.

---

## Reproducibility & RA Onboarding

A core goal of this project is **long-term reproducibility**.

The repository includes:

- Step-by-step lab manuals
- Data transfer protocols
- Website modification documentation
- Clear separation of experimental phases

A new research assistant should be able to:

1. Understand the study design
2. Recreate the websites
3. Run experimental sessions independently
4. Prepare data for analysis

---

## Technical Stack

- **HTML / CSS / JavaScript** – Website manipulation
- **Python** – Data preprocessing and analysis
- **Tobii SDK / CSV exports** – Eye-tracking
- **GitHub Pages / Local hosting** – Controlled deployment
- **Markdown / Obsidian** – Documentation and lab manuals

---

## Active Use Status

✅ **Actively used in ongoing research**

This system is currently deployed in **live child memory studies** within **Dr. Kim Roberts’ Child Memory Lab**, supporting:

- Participant sessions
- Credibility instruction lessons
- Eye-tracking data collection
- Longitudinal analysis planning

---

## Author

**Michelle Chala**  
Computer Science & Psychology  
Computational & Cognitive Neuroscience  
Business Minor
Wilfrid Laurier University  

Research Developer – Child Memory Lab  
AI / Data / Experimental Systems

---

## Notes for Reviewers & Collaborators

This project prioritizes:

- Experimental validity over polish
- Documentation over abstraction
- Reproducibility over automation

It is designed to **survive handoff**, not just demonstration.


---
name: sufi-channel-translator
description: >
  Processes Turkish YouTube videos from a Sufi-science channel into focused English articles
  for the portfolio website. Use this skill whenever the user provides a YouTube URL or video ID
  from this channel and wants it turned into a web-ready article.
  Also triggers for phrases like "translate this video", "make an article from this video",
  "post this to my site", or "add this to the articles section". The output is a concise
  Markdown article that distills only the subject-matter content — personal preambles,
  digressions, and filler are excluded.
---

# Sufi Channel Translator

Converts Turkish YouTube videos (Sufi thought × science channel) into focused English Markdown
articles for the portfolio website. The goal is a clean, readable article built from the
ideas in the video — not a transcript. Extract what the speaker is actually arguing or
explaining. Leave out everything else.

---

## Pipeline Overview

```
YouTube URL / Video ID
        │
        ▼
1. Extract Turkish captions (yt-dlp)
        │
        ▼
2. Clean raw caption text
        │
        ▼
3. Translate & distill — subject matter only
        │
        ▼
4. Format as Markdown article
        │
        ▼
5. Write to  articles/<slug>.md  in the portfolio project
```

---

## Step 1 — Extract Captions

Use `yt-dlp` to pull the Turkish subtitle track. Prefer manually uploaded subtitles (`tr`)
over auto-generated (`tr` auto-sub). Fall back to auto-generated only if manual is absent.

```bash
# Preferred: manual Turkish subtitles
yt-dlp --write-subs --sub-lang tr --skip-download \
       --output "%(id)s.%(ext)s" "<VIDEO_URL>"

# Fallback: auto-generated Turkish subtitles
yt-dlp --write-auto-subs --sub-lang tr --skip-download \
       --output "%(id)s.%(ext)s" "<VIDEO_URL>"
```

The result is a `.tr.vtt` or `.tr.srv3` file. Convert it to plain text by stripping all
VTT/SRT timestamps and formatting tags before proceeding.

### Caption cleaning script

```python
import re, sys

def clean_vtt(path):
    text = open(path, encoding="utf-8").read()
    # Remove WEBVTT header
    text = re.sub(r"WEBVTT.*?\n\n", "", text, flags=re.DOTALL)
    # Remove timestamp lines  e.g. 00:00:04.560 --> 00:00:07.200
    text = re.sub(r"\d{2}:\d{2}:\d{2}[\.,]\d+ --> .+\n", "", text)
    # Remove HTML/VTT tags
    text = re.sub(r"<[^>]+>", "", text)
    # Collapse duplicate adjacent lines (common in VTT rolling captions)
    lines = text.splitlines()
    deduped = [lines[0]] if lines else []
    for line in lines[1:]:
        if line.strip() and line.strip() != deduped[-1].strip():
            deduped.append(line)
    return "\n".join(l for l in deduped if l.strip())

if __name__ == "__main__":
    print(clean_vtt(sys.argv[1]))
```

Run: `python clean_vtt.py <video_id>.tr.vtt > cleaned.txt`

---

## Step 2 — Translate & Distill

Read the full cleaned Turkish text first to understand the subject matter, then produce
a focused English article. This is not a transcription — it is an abstraction.

### Translation system prompt

```
You are processing a transcript from a Turkish YouTube channel about Sufi thought and science.
Your job is to produce a concise, readable English article from the transcript.

WHAT TO KEEP:
- The core argument, thesis, or idea the speaker is developing
- Analogies and thought experiments that illustrate the concept
- Key Sufi, philosophical, or scientific terms being explained
- Any conclusion or call to reflection the speaker makes

WHAT TO REMOVE:
- Personal preambles (anniversary remarks, personal backstory, how long the speaker has
  been studying, etc.) unless directly relevant to the concept
- Repetitions and restatements of the same point
- Filler phrases, conversational asides, and audience greetings
- Digressions that do not serve the main subject matter
- Any content that does not help the reader understand the central idea

STRICT RULES:
1. Write in plain, everyday English. Use short sentences. Avoid academic or technical phrasing
   unless the concept genuinely requires it — and if it does, explain it immediately in simple terms.
2. Write as continuous paragraphs — no bullet points, no dashes, no lists.
3. Do not begin any sentence or paragraph with a dash (–, —, or -).
4. Sufi and Islamic terms (e.g. "nefs", "ruh", "tevekkül", "zikir", "fenafillah") should be
   transliterated the first time they appear, followed by a plain English explanation in
   parentheses — e.g. nefs (the ego-self). After the first occurrence, use the transliterated
   term only.
5. Scientific and technical terms should be translated into everyday equivalents wherever possible.
6. Do not add your own ideas, commentary, or interpretation — only what the speaker argues.
7. The finished article should be concise enough that a reader can absorb it in 3–5 minutes.

Return only the article text. No preamble, no sign-off.
```

---

## Step 3 — Build the Markdown Article

Once distillation is complete, wrap it in the standard article template.

### Frontmatter fields to populate

| Field | Source |
|---|---|
| `title` | Translate the video title from Turkish to English |
| `date` | Video publish date (fetch from yt-dlp metadata or YouTube page) |
| `source_url` | Full YouTube URL |
| `source_language` | `Turkish` |
| `channel` | Channel name (transliterated + English if needed) |
| `tags` | Infer 3–5 tags from content (e.g. `sufi`, `consciousness`, `science`, `ruh`) |
| `slug` | URL-safe kebab-case from English title |

### Article template

```markdown
---
title: "<English title>"
date: "<YYYY-MM-DD>"
source_url: "<full YouTube URL>"
source_language: Turkish
channel: "<channel name>"
tags: [<comma-separated tags>]
slug: "<slug>"
---

# <English title>

<article body — continuous paragraphs, no bullet points, no dashes>
```

---

## Step 4 — Write to Portfolio

Save the article to the portfolio project's articles directory.

```bash
articles/<slug>.md
```

When creating the HTML version of the article, include a back link at the top of the
`<article>` element, before the header, and a credit block at the end of the article body:

```html
<a href="../writing.html" class="article-back">← All articles</a>
```

At the end of the article body, after the last `</div>` closing the `article-body`:

```html
<div class="article-credit">
  <span>Ahmed Hulusi</span>
</div>
```

After writing, confirm the file path to the user and note any manual steps needed
(e.g. restarting a dev server, committing to git).

---

## Quality Checklist

Before delivering the article, verify:

- [ ] The central idea or argument of the video is clearly present
- [ ] Personal preambles, repetitions, and digressions have been removed
- [ ] No content was added beyond what the speaker argues
- [ ] Sufi terms are transliterated + glossed on first use only
- [ ] No sentence or paragraph begins with a dash
- [ ] Article reads comfortably in 3–5 minutes
- [ ] Frontmatter is complete and the slug is URL-safe
- [ ] Article has been written to the correct path in the portfolio

---

## Handling Missing or Poor Captions

| Situation | Action |
|---|---|
| No Turkish captions at all | Tell the user — manual transcription or a third-party ASR tool is needed before this skill can proceed |
| Only auto-generated captions (low quality) | Proceed but flag to the user: *"Auto-generated captions were used — the article may have minor errors in technical or Sufi terminology. Please review."* |
| Caption file downloads but is empty | Re-run yt-dlp with `--verbose` and share the output with the user for diagnosis |
| Video is age-gated or private | Inform user — yt-dlp cannot access this without authentication cookies |

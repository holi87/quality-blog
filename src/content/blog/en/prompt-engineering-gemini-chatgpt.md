---
title: "Prompt engineering in practice - images, video, Gemini, Veo, and ChatGPT Images without mythology"
description: "Prompt engineering for images and video without the mythology: how to think about prompts for Gemini, Imagen, Veo, and ChatGPT Images. The prompt as a specification of intent, not a magic spell."
date: 2026-06-19
tags: ["ai", "prompt engineering", "ai images", "ai video", "gemini", "chatgpt"]
lang: en
readingTime: 11
author: [JS, GH]
---

## Introduction: prompt engineering is not a trick; it is a specification of intent

When working with AI-generated images and video, it is easy to fall into one of two extremes. The first says: “the prompt does not matter; the model will do whatever it wants.” The second says: “there is a perfect magic formula that always produces the right result.” Both are wrong. Prompts matter a lot, but they do not work like spells. They work more like specifications: the clearer the goal, constraints, and quality criteria, the more likely the model is to move in the right direction.

In 2026, visual AI tools are much more mature than early text-to-image generators. Google’s ecosystem includes tools and models such as **Imagen**, **Gemini Image / Nano Banana**, **Veo 3.1**, and **Gemini Omni**. OpenAI develops **ChatGPT Images** and the **GPT Image** model family. These systems can generate images, edit existing graphics, use reference images, generate video from text or image input, and increasingly support iterative conversations about changes.

That does not mean you can write prompts carelessly. The more capable the tool, the more important precision becomes. For a simple image, “cat in space” might be enough. For a blog header, presentation, marketing asset, application mockup, or product video, you need composition, style, lighting, text rules, aspect ratio, constraints, and a clear description of what should not change.

This article is not a ranking that says “Gemini is always better” or “ChatGPT is always more creative.” Such comparisons become outdated very quickly. A better approach is to understand how to write prompts for different formats: static image generation, image editing, video generation, and conversational iteration.

## First, let’s clean up the model names

AI articles often contain model names that sound plausible but are mixed up or already outdated. It is worth being careful.

In Google’s ecosystem, several related but distinct concepts appear. **Imagen** is a family of image generation models. Gemini API documentation describes image generation and prompting practices for Imagen. **Gemini Image**, also known through the Nano Banana branding, is an image-oriented Gemini model line designed for creation and editing with multimodal understanding. **Veo 3.1** is a video generation model that supports video with audio, text input, image input, reference images, first and last frames, and video extension. **Gemini Omni** is presented by Google DeepMind as a creative multimodal direction for Gemini, combining reasoning, editing, and work with different input types.

On the OpenAI side, it is safer today to talk about **ChatGPT Images** and **GPT Image** models rather than only DALL·E. DALL·E 3 is still a recognizable name, but current developer materials focus on the GPT Image family for image generation and editing. OpenAI documentation lists `gpt-image-2` as well as earlier models such as `gpt-image-1.5`, `gpt-image-1`, and `gpt-image-1-mini`. That is why “ChatGPT Images / GPT Image” is a more future-resistant phrase than claiming that one specific model is the universal standard for every user.

This matters in practice. You prompt a static image in Imagen differently from a film in Veo, and you prompt an iterative edit in ChatGPT Images differently again. One universal prompt template for everything usually produces random results.

## Image prompts: subject, context, style, and constraints

For static images, the most important layers are: **what should appear**, **where it happens**, **what style it should use**, and **what must remain controlled**. Google’s Imagen guidance emphasizes a simple core: subject, context/background, and style. That may sound obvious, but in practice it solves many beginner problems.

Weak prompt:

> Modern quality dashboard application.

Better prompt:

> A realistic laptop mockup on a desk in a bright office. On the screen, a software quality dashboard is visible with cards for test coverage, flaky tests, build status, and release risk. Style: modern SaaS product, light interface, clean typography, subtle shadows, no recognizable company logos.

The second prompt is better because it defines the object, environment, content, style, and brand restriction. It does not merely say “make it nice.” It explains what “nice” means in this context.

Photographic parameters are useful, but only when they serve a purpose. Terms such as “macro lens,” “wide angle,” “shallow depth of field,” “natural light,” “studio lighting,” “soft shadows,” or “film noir” can help. But if every prompt contains “cinematic, ultra detailed, award winning, 8k, masterpiece,” you are not controlling quality. You are creating noise.

A useful image prompt template looks like this:

> [format and style] + [main subject] + [context/background] + [composition] + [lighting/color] + [required elements] + [constraints]

Example for a technology blog:

> Editorial illustration for an article about automated testing. Main subject: a test architect analyzing a dependency map between services. Background: an abstract network of backend modules and a CI/CD pipeline. Horizontal 16:9 composition, main person on the left, readable connection map on the right. Colors: navy, white, green accents. Style: modern technology illustration, not photorealistic, no text in the image, no company logos.

Notice “no text in the image.” Models are getting better at rendering text, but they can still make mistakes, especially with longer phrases and precise placement. Imagen documentation recommends short text, iteration, and awareness that placement may vary. OpenAI documentation also notes that models can still struggle with precise text placement and clarity.

Practical conclusion: if you need perfect typography, logos, or UI labels, it is often better to generate the background without text and add typography later in a design tool. AI can prepare the composition, mood, and illustration. Final typography is still often a human design task.

## Image editing prompts: what to change and what not to touch

Image editing requires a different mindset from generation. The key is to separate two lists: **change** and **do not change**. If you upload a product photo and ask “make it more premium,” the model may change the background, product color, proportions, details, or even the nature of the object. For inspiration, that may be interesting. For production work, it is a problem.

A better editing prompt:

> Change only the background and lighting. The product, its color, shape, logo, proportions, and position must remain unchanged. Add warm studio lighting, a beige background, and a soft shadow under the product. Do not add text, watermarks, or additional objects.

When using ChatGPT Images or GPT Image models, it is useful to repeat constraints in later iterations. Do not assume the model will preserve all previous conditions in a long conversation. A practical rule is: in every important iteration, restate the elements that must remain invariant. OpenAI’s prompting guidance for GPT Image 1.5 emphasizes explicit constraints and separating what should change from what must remain unchanged.

This is very similar to testing. An editing prompt should have acceptance criteria. For a blog graphic, the criteria might be:

- 16:9 format,
- no text,
- no recognizable company logos,
- style consistent with the blog identity,
- clear space for a title,
- readable as a thumbnail,
- no deformed hands, faces, screens, or UI elements.

You can paste those criteria directly into the prompt. The model then receives not only a creative request, but also quality conditions.

## Video prompts: now time, motion, and sound matter

Video is not just “image plus animation.” It is a separate format. The prompt must describe not only the scene, but also **what happens over time**. For Veo 3.1, a useful prompt should include subject, action, style, camera movement, composition, lens effects, lighting, and - where relevant - audio.

Google’s Veo guidance lists elements such as subject, action, style, camera positioning and motion, composition, focus/lens effects, and ambiance. That is a practical checklist before generating a clip.

Weak prompt:

> Make a video about AI in testing.

Better prompt:

> Short 8-10 second video, realistic and modern style. Scene: a night-time QA team office, with a large monitor showing an abstract CI/CD pipeline and green test statuses. Action: the camera slowly moves from a keyboard to the screen; at the end, a test architect is visible analyzing the dashboard. Camera movement: smooth dolly shot, eye-level, slight zoom-in. Lighting: cool monitor light with a subtle warm desk lamp. Audio: low office ambience, soft keyboard clicks, no dialogue. No recognizable company logos, no readable text on screen.

This prompt gives the model a scene, motion, and restrictions. If you are creating product video, you may add aspect ratio, pacing, first frame, final frame, reference objects, and whether the model must preserve the appearance of a person or product.

Veo 3.1 supports text-to-video, image-to-video, reference images, first and last frames, and extending previous video. This makes a structured workflow possible: first generate a still image or reference frame, then use it as a starting point for video. That is usually more controlled than asking the model to invent everything at once.

Video has another issue: it can look impressive while missing the communication goal. That is why the prompt needs intent. You write differently for an atmospheric intro, a product ad, an educational animation, and a product demo. “Cinematic” is not a strategy. A strategy is: who will watch this, what should they understand, and what action should they take afterward?

## Gemini vs ChatGPT: practical differences, not a religious war

AI tool comparisons are often too categorical. “Gemini is literal, ChatGPT is creative” can be a useful shorthand, but it should not be treated like a law of physics. Models change, product layers change, and results depend on the prompt, settings, model availability, and task type.

It is safer to talk about working tendencies.

| Area | Gemini / Imagen / Gemini Image / Veo | ChatGPT Images / GPT Image |
| :--- | :--- | :--- |
| Image generation | Strong for precise scene descriptions, context, photographic styles, and reference-driven work. | Strong for conversational work, fast iteration, creative variants, and natural-language edits. |
| Video | Veo 3.1 is specialized for video generation, camera motion, audio, frames, and references. | ChatGPT can help prepare prompts, scripts, storyboards, and evaluation criteria, while actual video generation depends on tools available in the user’s plan or ecosystem. |
| Text in image | Improving, but short text and verification are still recommended. | Also improving, but documentation still notes possible issues with clarity, placement, and consistency. |
| Editing | Strong when references and constraints are explicit. | Strong in conversational iteration, especially when invariants are repeated clearly. |
| Main risk | A technically detailed prompt without a communication goal. | A loose prompt that lets the model beautify the output at the expense of control. |

In practice, the best workflow is often mixed. ChatGPT can prepare the brief, variants of the prompt, quality checklist, and alternative descriptions. Gemini or Veo can generate the specific image or video from the refined brief. Then you can return to an LLM and ask for critique: does the graphic fit the article, does it look too generic, will the thumbnail be readable, and are there legal or communication risks?

## How to write prompts that actually help

Good practice number one: **start with the goal, not the style**. Instead of “make a nice AI graphic,” write: “the graphic is a header for an article about using LLMs in testing; it should look professional but not corporate; it should suggest quality control, automation, and a human in the loop.”

Good practice number two: **separate content from form**. Content means who, what, where, and what situation. Form means style, color, lens, light, composition, and aspect ratio. If these are mixed randomly, the prompt becomes harder to control.

Good practice number three: **state constraints as quality criteria**. Not just “no chaos,” but “maximum three main objects, bright background, no text, no logos, readable as a 1200x630 thumbnail.”

Good practice number four: **iterate in small steps**. If the first result has a good composition but poor lighting, do not rewrite the whole prompt. Ask for lighting changes while preserving composition. If the model changes too much, restate the invariants.

Good practice number five: **treat a prompt like a test case**. Save prompt versions and outputs. If a prompt is supposed to produce a consistent style for a series of articles, treat it as a reusable template. This is especially important for a blog that should have a recognizable visual identity.

## Example prompt for a blog header image

> Create a 16:9 header illustration for a technology article on Quality Blog. Topic: using AI to design test automation. Style: modern editorial illustration, clean lines, slightly technical, not photorealistic. Scene: a test architect stands in front of a large screen with an abstract map of tests, a CI/CD pipeline, and quality icons. Composition: person on the left, system map on the right, enough empty space for a title. Colors: light background, navy, white, green accents. Constraints: no company logos, no readable text, no watermarks, no deformed hands, no famous faces.

This prompt does not guarantee perfection, but it gives a strong starting point. If the result is too corporate, you can shift the style toward “hand-drawn technical illustration.” If it is too playful, add “more mature, less playful, professional software engineering tone.”

## Example prompt for video

> Generate a short vertical 9:16 social media video, 8 seconds. Topic: AI helps a QA team find release risk faster. Seconds 0-2: an abstract dashboard with red and green test statuses. Seconds 3-5: the camera moves to a person analyzing the result on a laptop. Seconds 6-8: red risks group into a readable map and most statuses turn green. Style: realistic, modern office, calm professional mood. Camera: smooth tracking shot, slight zoom-in. Lighting: cool screen light with subtle warm side light. Audio: soft technology ambience, no dialogue. Constraints: no real logos, no personal data, no chaotic flashing text.

The most important part is the timeline. The model knows what should happen across the clip. That increases the chance of getting a small story rather than just a visually impressive scene.

## How to review results before publishing

Visual AI can produce something that looks great at first glance but becomes empty or wrong after a closer look. Before publishing, it is worth doing a short review.

Control questions:

- Does the image actually support the article topic?
- Does it look like generic stock art?
- Does it contain accidental text, logos, or watermarks?
- Is it readable as a thumbnail?
- Does it imply product capabilities the article does not describe?
- Are people, devices, and interfaces visually coherent?
- Does the style match other blog materials?
- Could the graphic mislead the reader?

The last question is especially important. If the article is about test automation and the image suggests “AI certifies the release by itself,” the message is exaggerated. A good graphic should support the article, not promise more than the text says.

## Summary: less magic, more specification

The best prompts are not necessarily the longest. The best prompts are the most intentional. They define the goal, format, audience, content, style, constraints, and quality criteria. For images, the key elements are subject, context, style, and composition. For image editing, the key is the list of changes and the list of things that must not change. For video, the key elements are time, action, camera movement, mood, and audio.

The biggest mistake is treating visual AI like a random inspiration generator and then expecting production-ready results. The second mistake is publishing model comparisons in absolute language. Gemini, Veo, and ChatGPT Images change quickly. It is better to write about practical workflows than eternal advantages of one tool over another.

If you use AI for a blog, presentation, or QA-related material, treat the prompt as a mini creative brief. It does not need to be perfect from the start. It needs to be clear enough to iterate. Then AI stops being a toy for impressive images and becomes a real part of the creative process.

**Sources and verification:**

- [Google AI for Developers - Generate images using Imagen](https://ai.google.dev/gemini-api/docs/imagen)
- [Google AI for Developers - Generate videos with Veo 3.1](https://ai.google.dev/gemini-api/docs/video)
- [Google DeepMind - Gemini Image / Nano Banana](https://deepmind.google/models/gemini-image/)
- [Google DeepMind - Gemini Omni](https://deepmind.google/models/gemini-omni/)
- [OpenAI API Docs - Image generation](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI Cookbook - GPT Image 1.5 prompting guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-1.5-prompting_guide)

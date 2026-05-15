/**
 * Guided steps for each experience in the catalog.
 *
 * Each step has:
 *  - title:   Short instruction shown prominently
 *  - detail:  A gentle, more descriptive nudge
 *  - seconds: Timer duration (0 = no timer for this step)
 */

export type ExperienceStep = {
  title: string;
  detail: string;
  seconds: number;
};

type StepMap = Record<string, ExperienceStep[]>;

const STEPS: StepMap = {
  "golden-hour-walk": [
    { title: "Step outside", detail: "Find the last hour before sunset. Leave your headphones behind.", seconds: 0 },
    { title: "Walk slowly", detail: "Let your pace match the light — unhurried, without destination.", seconds: 600 },
    { title: "Find a shadow or reflection", detail: "Look for something the sun is transforming. A puddle, a wall, a window. Pause here.", seconds: 180 },
    { title: "Take one photograph", detail: "Not of a landmark — of a detail. Something small that usually goes unnoticed.", seconds: 0 },
    { title: "Walk back in silence", detail: "No music, no scrolling. Let the colours settle inside you.", seconds: 300 },
  ],

  "doodle-weather": [
    { title: "Gather your tools", detail: "Any pen, any paper. A sticky note is enough.", seconds: 0 },
    { title: "Close your eyes for a breath", detail: "Notice what your body feels like right now. Is it heavy? Sparky? Foggy?", seconds: 30 },
    { title: "Draw the weather inside you", detail: "No skill needed — lines, shapes, colours. Whatever comes first is right.", seconds: 180 },
    { title: "Name it gently", detail: "Write one word somewhere on the page. Not a verdict — just a name.", seconds: 0 },
  ],

  "single-frame-film": [
    { title: "Find the most cinematic corner of your space", detail: "Look for light, shadow, or texture. Could be the window, the lamp, the steam from your cup.", seconds: 0 },
    { title: "Set your angle", detail: "Hold the camera still. Let the scene breathe for a moment before you press record.", seconds: 30 },
    { title: "Record 30 seconds, uninterrupted", detail: "No cuts. Let something move — light shifting, steam rising, anything.", seconds: 30 },
    { title: "Watch it back once", detail: "Without judgement. You just made something that didn't exist before.", seconds: 0 },
  ],

  "dance-one-song": [
    { title: "Dim the lights", detail: "Or close your eyes — whatever makes you feel less watched.", seconds: 0 },
    { title: "Pick your song", detail: "Something that has always made your body want to move.", seconds: 0 },
    { title: "Move to it, all the way through", detail: "No choreography. No mirrors. Just let the music lead your limbs.", seconds: 240 },
    { title: "Rest when it ends", detail: "Stay still for a breath after the last note. Feel the difference in your body.", seconds: 30 },
  ],

  "story-from-stranger": [
    { title: "Remember someone you saw today", detail: "A stranger on the street, in a queue, through a window. Bring them to mind.", seconds: 60 },
    { title: "Give them a name quietly", detail: "It doesn't need to be right. Just a name to hold them with.", seconds: 0 },
    { title: "Write their hidden chapter", detail: "One paragraph. What happened to them this morning that nobody knows about?", seconds: 300 },
    { title: "End it with kindness", detail: "Give them something good — a small grace in their story that they needed.", seconds: 0 },
  ],

  "sunset-reflection": [
    { title: "Find your window or corner of sky", detail: "Sit where you can see the light changing. Put your phone face-down.", seconds: 0 },
    { title: "Watch without capturing", detail: "No photos for now. Let your eyes just receive the colour.", seconds: 300 },
    { title: "Notice what you feel", detail: "Not what you think you should feel. What is actually happening in your chest?", seconds: 120 },
    { title: "Stay until the colours finish", detail: "That moment when the sky goes from colour to grey — be there for it.", seconds: 300 },
  ],

  "letter-to-past-self": [
    { title: "Choose which version of you", detail: "Pick an age, a season, a moment. A time when you were kinder to yourself, or needed kindness most.", seconds: 0 },
    { title: "Begin with 'Dear —'", detail: "And their age, or the year, or just a name you gave yourself then.", seconds: 0 },
    { title: "Write what you wish they had known", detail: "Not advice. Reassurance. The things that turned out okay that they were scared of.", seconds: 600 },
    { title: "End with something tender", detail: "Sign it however feels true. Keep it, or let it go.", seconds: 0 },
  ],

  "tea-ritual": [
    { title: "Boil the water slowly", detail: "While you wait, clear the surface you'll drink at. Just that surface.", seconds: 120 },
    { title: "Pour with attention", detail: "Watch the colour bloom in the cup. Feel the warmth through your hands.", seconds: 60 },
    { title: "Breathe over the steam", detail: "Three slow breaths in the rising warmth before your first sip.", seconds: 30 },
    { title: "Drink without screens", detail: "Just the tea, the warmth, and whatever your mind wants to visit gently.", seconds: 240 },
  ],

  "memory-album": [
    { title: "Find an old album or photo folder", detail: "Physical or digital — something you haven't opened in a while.", seconds: 0 },
    { title: "Scroll or turn slowly until one image stops you", detail: "Not the best photo — the one that holds something.", seconds: 120 },
    { title: "Write three lines about the air", detail: "Not what happened. What it felt like to breathe in that moment.", seconds: 0 },
    { title: "Put it somewhere you'll see", detail: "Set it as your lock screen for a day, or leave the album open. Let it stay close.", seconds: 0 },
  ],

  "rain-listen": [
    { title: "Find or play rain", detail: "A window if it's raining, or a rain recording if it isn't. No shuffle — just rain.", seconds: 0 },
    { title: "Settle your body", detail: "Lie down, or sit with your back supported. Let your weight go into whatever holds you.", seconds: 60 },
    { title: "Only listen", detail: "No task. Let the rhythm of the rain become the only rhythm.", seconds: 300 },
    { title: "Notice what loosens", detail: "In the last minute, check in. What feels slightly different in your body?", seconds: 60 },
  ],

  "bookstore-wander": [
    { title: "Enter and resist the new releases table", detail: "Go deeper. Let yourself drift toward a section that surprises you.", seconds: 0 },
    { title: "Read only first sentences", detail: "Open books at random. Read the very first line. Set it down. Keep wandering.", seconds: 600 },
    { title: "Let one cover stop you", detail: "Not because you want to read it — because something in the image or title holds you.", seconds: 0 },
    { title: "Photograph just the cover", detail: "Save it as a reminder of what caught your attention and why.", seconds: 0 },
  ],

  "cafe-window": [
    { title: "Order something warm", detail: "Whatever you'd drink if you had all the time you needed.", seconds: 0 },
    { title: "Choose a window seat", detail: "If there isn't one, any seat where you can see people passing.", seconds: 0 },
    { title: "Watch the street without your phone", detail: "For ten minutes, just let the world move while you stay still.", seconds: 600 },
    { title: "Finish your drink slowly", detail: "You don't have to be anywhere. This is the appointment.", seconds: 600 },
  ],

  "compliment-stranger": [
    { title: "Notice one true thing", detail: "Something about someone near you that you genuinely appreciate — their laugh, their shoes, the way they're kind to someone else.", seconds: 120 },
    { title: "Find the words quietly", detail: "Specific is better than big. 'Your earrings are beautiful' lands better than 'you look great'.", seconds: 0 },
    { title: "Say it, then step back", detail: "No waiting for a response, no conversation required. Just offer it and let it go.", seconds: 0 },
    { title: "Notice what happens in your chest", detail: "Generosity leaves a small warmth. Stay with it for a breath.", seconds: 30 },
  ],

  "reach-out-old-friend": [
    { title: "Let someone float into your mind", detail: "Not the person you talk to most — someone you've drifted from. Someone warm.", seconds: 60 },
    { title: "Write the message", detail: "No update required. No question. Just: 'I was thinking of you today and it made me smile.'", seconds: 120 },
    { title: "Send it without waiting", detail: "Don't revise it into something smaller. Send it before you think twice.", seconds: 0 },
    { title: "Let it be enough", detail: "You don't need a reply for this to have mattered. It already did.", seconds: 0 },
  ],

  "unfamiliar-street": [
    { title: "Walk to the edge of the familiar", detail: "Go to the street where you usually turn back. Keep going instead.", seconds: 0 },
    { title: "Walk slowly enough to notice", detail: "What's on the windowsills, the gates, the walls. What names are on the signs?", seconds: 600 },
    { title: "Find one thing that surprises you", detail: "A mural, a garden, a cat, a view. Something you wouldn't have seen otherwise.", seconds: 0 },
    { title: "Walk back a different way", detail: "Even one extra block. Let the return be as unhurried as the going.", seconds: 300 },
  ],

  "different-route-home": [
    { title: "Pick your next turn wrong on purpose", detail: "At the first junction after you leave — take the one you never take.", seconds: 0 },
    { title: "Walk with curiosity, not speed", detail: "You're not late. You're exploring.", seconds: 600 },
    { title: "Photograph the first surprise", detail: "Whatever stops you — take one photo. You're documenting what this version of home looks like.", seconds: 0 },
    { title: "Find your way back slowly", detail: "Let yourself be slightly uncertain. That's the whole point.", seconds: 300 },
  ],

  "rooftop-or-hill": [
    { title: "Find your higher ground", detail: "Rooftop, hill, parking deck, the top step of a long staircase. Anywhere the horizon is wider than usual.", seconds: 0 },
    { title: "Get there before dark", detail: "Arrive while there's still colour in the sky. Dusk is the point.", seconds: 0 },
    { title: "Stand and look outward", detail: "Not down at your phone. At the city, the sky, the distance. Let the scale do something to you.", seconds: 600 },
    { title: "Stay until one star appears", detail: "Or until the city lights turn on below you. Either is enough.", seconds: 600 },
  ],

  "midnight-snack-hunt": [
    { title: "Go somewhere you've never eaten after dark", detail: "A stall, a 24-hour place, a bakery. Somewhere slightly unfamiliar.", seconds: 0 },
    { title: "Order something you haven't had before", detail: "Or your most comforting thing. Trust what you feel like tonight.", seconds: 0 },
    { title: "Sit and eat slowly", detail: "No scrolling. Just the food, the night, and whatever sounds exist around you.", seconds: 900 },
    { title: "Walk home a little longer than needed", detail: "Let the night air have its say before you go inside.", seconds: 300 },
  ],

  "morning-light-hunt": [
    { title: "Step outside before the city is loud", detail: "Set your alarm 30 minutes earlier than usual. Go out while it's still quiet.", seconds: 0 },
    { title: "Walk toward the light", detail: "Wherever the sun is rising — turn to face it and let it find your face.", seconds: 300 },
    { title: "Keep walking until the world wakes up", detail: "Listen to the shift: birds, then engines, then voices. You're watching a day begin.", seconds: 900 },
    { title: "Find somewhere to stand still for a moment", detail: "Breathe in the light. This is the most reliable mood reset there is.", seconds: 120 },
  ],
};

/**
 * Returns the guided steps for a given experience slug.
 * Falls back to a single gentle step if the slug is unknown.
 */
export function stepsFor(slug: string): ExperienceStep[] {
  return (
    STEPS[slug] ?? [
      {
        title: "Begin gently",
        detail: "There are no fixed steps for this experience. Let yourself move through it at your own pace.",
        seconds: 0,
      },
    ]
  );
}

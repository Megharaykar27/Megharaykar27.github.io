// Everything that changes often lives here: projects and skills.
// flower: petals, layers and colours of the drawing on the plate.
export const PROJECTS = [
  {
    slug: "mytwin", name: "MyTwin", by: "with Miu inside", tagline: "A twin AI that answers recruiters from real facts", image: "assets/work/mytwin.jpg", repo: "https://github.com/Megharaykar27/MyTwin",
    tech: ["React", "Node.js", "Express", "SQLite", "Gemini API", "Tailwind CSS"], flower: { petals: 9, layers: 4, hue: "rose" }, live: true,
    seed: "Recruiters have questions at any hour. I wanted an honest answer ready, even when I'm asleep.",
    grew: "I built Miu: a chat that first finds the matching facts in my resume and project notes, then answers only from those. Answers stream live and show their sources.",
    bloom: ["Says “I don't know” and lets you leave a message", "Job-fit check that compares a job description with my skills", "Owner's admin panel, plus a one-line widget for any website", "29 automated tests"],
  },
  {
    slug: "snapprice", name: "SnapPrice", by: "price finder", tagline: "Snap a product, find it cheaper across Indian stores", image: "assets/work/snapprice.jpg", repo: "https://github.com/Megharaykar27/SnapPrice",
    tech: ["React", "Node.js", "Express", "SQLite", "Gemini API", "SerpApi"], flower: { petals: 6, layers: 3, hue: "gold" },
    seed: "“75% off” is often not a real discount. Shoppers deserve to know.",
    grew: "A photo, screenshot, link or name becomes a price comparison across Indian stores, with the cheapest safe deal on top.",
    bloom: ["Flags inflated MRPs, suspicious sellers and look-alikes", "Deal score from 0 to 100 for every offer", "Price watch with a buy-now-or-wait verdict", "Demo mode that works with no keys"],
  },
  {
    slug: "skinscan", name: "SkinScan", by: "computer vision", tagline: "Selfie skin analysis with Python and OpenCV", image: "assets/work/skinscan.jpg", repo: "https://github.com/Megharaykar27/SkinScan",
    tech: ["Python", "OpenCV", "FastAPI", "React", "Node.js", "SQLite"], flower: { petals: 8, layers: 3, hue: "blush" },
    seed: "Skincare labels are hard to read, and advice rarely fits your own skin.",
    grew: "The browser finds 68 face points, then a Python engine measures five zones. A label checker reads ingredients, and a routine is built from the results.",
    bloom: ["Compares each zone with your own skin, so it's fair across skin tones", "About 200 ingredients explained in plain words", "Refuses photos it can't judge fairly", "53 Python tests"],
  },
  {
    slug: "neurocheck", name: "NeuroCheck", by: "honest machine learning", tagline: "Explainable stroke-risk assessment", image: "assets/work/neurocheck.jpg", repo: "https://github.com/Megharaykar27/NeuroCheck",
    tech: ["Python", "Flask", "scikit-learn", "React", "SQLAlchemy"], flower: { petals: 5, layers: 2, hue: "sage" },
    seed: "My first stroke model looked 83.95% accurate. Something felt too good.",
    grew: "I found hidden near-copies in the data: 407 stroke rows were really 246 patients. I rebuilt the testing so copies can't leak, and reported the honest result.",
    bloom: ["Honest ROC-AUC of 0.84 with leak-safe testing", "Catches 80% of stroke patients at the screening line", "Shows how much each answer changes the risk", "Live “what if” sliders"],
  },
  {
    slug: "styletwin", name: "StyleTwin", by: "AI fitting room", tagline: "Virtual try-on, smart wardrobe and outfit planner", image: "assets/work/styletwin.jpg", repo: "https://github.com/Megharaykar27/StyleTwin",
    tech: ["React", "Node.js", "Express", "SQLite", "Gemini API", "IDM-VTON"], flower: { petals: 12, layers: 3, hue: "rose" },
    seed: "A full wardrobe, and still nothing to wear.",
    grew: "Upload a photo and a garment to see it on you. AI tags your clothes, and a planner scores every outfit you own for the occasion and weather.",
    bloom: ["Free try-on with a diffusion model", "Outfit planner that ranks your best three looks", "Kind, body-positive style profile", "Falls back gracefully when an AI step is busy"],
  },
  {
    slug: "glowup", name: "GlowUp", by: "online store", tagline: "Full-stack beauty store with an AI shopping advisor", image: "assets/work/glowup.jpg", repo: "https://github.com/Megharaykar27/GlowUp",
    tech: ["React", "Node.js", "Express", "MongoDB", "Gemini API", "Razorpay"], flower: { petals: 7, layers: 4, hue: "blush" },
    seed: "Beauty shopping is full of choices and short on guidance.",
    grew: "A complete store: search, reviews, wishlist, coupons, checkout and live order tracking, with an advisor that only recommends products that exist.",
    bloom: ["Razorpay payments in test mode, checked on the server", "Two shoppers can never buy the same last item", "Admin dashboard with revenue and low-stock alerts", "The advisor works without an AI key too"],
  },
  {
    slug: "habit-tracker", name: "Habit Tracker", by: "two-person team project", tagline: "Android habit app with streaks and a journal", image: "assets/work/habit-tracker.jpg", repo: "https://github.com/Megharaykar27/HabitTracker",
    tech: ["Kotlin", "Jetpack Compose", "Room", "Firebase"], flower: { petals: 10, layers: 2, hue: "sage" },
    seed: "Good habits fade when you can't see them.",
    grew: "A team project for our mobile course: an Android app with Material 3, MVVM, Coroutines and Flow.",
    bloom: ["Habits, streaks and progress stats", "Mood journal", "Local storage with Room and DataStore"],
  },
];

export const SKILLS = [
  ["Frontend", ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"]],
  ["Backend", ["Node.js", "Express", "Python", "Flask", "FastAPI"]],
  ["Databases", ["SQLite", "MongoDB", "MySQL", "SQLAlchemy"]],
  ["AI & ML", ["Gemini API", "scikit-learn", "OpenCV", "Machine Learning"]],
  ["Mobile & tools", ["Kotlin", "Jetpack Compose", "Git", "Linux", "Razorpay"]],
];

// Skills that don't appear as a project's main tech, with where they were used
export const ALSO = {
  JavaScript: ["mytwin", "snapprice", "skinscan", "neurocheck", "styletwin", "glowup"],
  HTML: ["mytwin", "snapprice", "skinscan", "neurocheck", "styletwin", "glowup"],
  CSS: ["mytwin", "snapprice", "skinscan", "neurocheck", "styletwin", "glowup"],
  "Tailwind CSS": ["mytwin", "snapprice", "skinscan", "styletwin"],
  "Machine Learning": ["neurocheck"],
  Git: ["mytwin", "snapprice", "skinscan", "neurocheck", "styletwin", "glowup", "habit-tracker"],
};
export const NOTES = { MySQL: "Learned in my degree and listed on my resume.", Linux: "Ubuntu, learned in my degree and listed on my resume." };

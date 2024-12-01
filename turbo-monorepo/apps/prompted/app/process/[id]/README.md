# Badge Documentation

## Level-Based Badges

These badges have multiple achievement levels with specific thresholds.

### Writing Volume & Quality (11 total)

- **Wordsmith**: Total words across all prompts
  - Levels: 500, 1000, 2000, 3000, 4000, 5000 words
- **Word Mania**: Highest word count in a single prompt
  - Levels: 100, 200, 300, 400, 500, 600 words
- **Concise Creator**: Entries with 100 words or less
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Simple Entry**: Entries between 100 and 250 words
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Quick Answer**: Entries between 250 and 400 words
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Developed Tale**: Entries between 400 and 650 words
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Rich Narrative**: Entries between 650 and 850 words
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Epic Story**: Entries over 850 words
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Vocab Explorer**: Entries with over 80% word uniqueness
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Copycat**: Entries under 30% word uniqueness
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **True OG**: Entries with over 95% word uniqueness
  - Levels: 5, 10, 20, 50, 100, 150 entries

### Vocabulary Tracking (2 total)

- **Uniqueness Collector**: Total unique words across all prompts
  - Levels: 500, 1000, 2000, 3000, 4000, 5000 words
- **Unique Writer**: Most unique words in a single prompt
  - Levels: 50, 100, 150, 200, 300, 500 words

### AI Interaction (3 total)

- **AI Collaborator**: Total AI interactions
  - Levels: 10, 25, 50, 100, 150, 200 calls
- **AI Whisperer**: Most AI calls in a single prompt
  - Levels: 10, 25, 50, 100, 150, 200 calls
- **Purely Human**: Entries without AI assistance
  - Levels: 5, 10, 15, 25, 50, 100 entries

### Time-Based Achievement (4 total)

- **Speed Racer**: Entries under 1 minute
  - Levels: 1, 5, 10, 15, 20, 25 entries
- **Quick Draw**: Entries between 1 and 5 minutes
  - Levels: 1, 5, 10, 15, 20, 25 entries
- **Walking Speed**: Entries between 5 and 10 minutes
  - Levels: 1, 5, 10, 15, 20, 25 entries
- **Turtle Wins**: Entries over 10 minutes
  - Levels: 1, 5, 10, 15, 20, 25 entries

### Time of Day (4 total)

- **Morning Dove**: Entries 6 AM - 12 PM UTC
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Afternoon Finch**: Entries 12 PM - 6 PM UTC
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Evening Eagle**: Entries 6 PM - 12 AM UTC
  - Levels: 5, 10, 20, 50, 100, 150 entries
- **Night Owl**: Entries 12 AM - 6 AM UTC
  - Levels: 5, 10, 20, 50, 100, 150 entries

### Category Progress (11 total)

All categories have the same level thresholds for number of entries: 10, 25, 50, 100, 150, 200 entries

- Calm Vibes
- Brain Puzzles
- Adventure Tales
- Creative Spark
- Inner Thoughts
- Playful Ideas
- Goal Inspiration
- Future Dreams
- Empathy Challenge
- Confidence Boost
- Gratitude Moments

## One-Time Achievement Badges

These badges are earned once when specific criteria are met.

### Milestones (10 total)

- **First Entry**: First submission
- **First 100 Words**: First entry over 100 words
- **First 250 Words**: First entry over 250 words
- **First 500 Words**: First entry over 500 words
- **First 1000 Words**: First entry over 1000 words
- **10th Entry**: Tenth submission
- **25th Entry**: Twenty-fifth submission
- **50th Entry**: Fiftieth submission
- **100th Entry**: Hundredth submission
- **150th Entry**: Hundred-fiftieth submission

### Special Achievements (4 total)

- **Exactly 1111 Words**: Entry with exactly 1111 words
- **Exactly 1234 Words**: Entry with exactly 1234 words
- **60 Seconds**: Entry completed in exactly 1 minute
- **First Human Entry**: First entry without AI assistance

### Category First Entries (11 total)

One-time badges for first submission in each category:

- First Calm Vibes Entry
- First Brain Puzzles Entry
- First Adventure Tales Entry
- First Creative Spark Entry
- First Inner Thoughts Entry
- First Playful Ideas Entry
- First Goal Inspiration Entry
- First Future Dreams Entry
- First Empathy Challenge Entry
- First Confidence Boost Entry
- First Gratitude Moments Entry

## Badge Properties

- **hasLevels**: Indicates if the badge has multiple achievement levels
- **thresholds**: For leveled badges, defines the requirements for each level
- **icon**: Unique icon representing the badge theme
- **criteria**: JavaScript-based calculation logic for badge progress

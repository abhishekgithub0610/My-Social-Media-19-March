import mayaAvatar from "@/assets/images/avatar/05.jpg";
import jordanAvatar from "@/assets/images/avatar/08.jpg";
import samAvatar from "@/assets/images/avatar/09.jpg";
import type { Book, Connection, Notebook, Person, Question } from "../types";

export const connections: Connection[] = [
  { id: "maya", name: "Maya Rao", avatar: mayaAvatar.src, eligible: true },
  { id: "jordan", name: "Jordan Lee", avatar: jordanAvatar.src, eligible: true },
  { id: "sam", name: "Sam Rivera", avatar: samAvatar.src, eligible: true },
  { id: "alex", name: "Alex Patel", eligible: false },
];

export const templates: Record<string, [string, Question["type"]]> = {
  "About Yourself": ["What small thing makes you feel most like yourself?", "short"],
  Friendship: ["Which memory of us would you save in a time capsule?", "long"],
  "Favourite Things": ["What's a song you never skip?", "short"],
  "Childhood Memories": ["What did a perfect afternoon look like when you were a kid?", "long"],
  "Life Experiences": ["When did you surprise yourself in a good way?", "long"],
  "Dreams and Goals": ["What dream would you love a friend to cheer you on for?", "long"],
  "Career and Professional Growth": ["What skill would you love to learn next?", "short"],
  "Personal Development": ["Which habit has helped you feel more grounded?", "short"],
  "Advice and Feedback": ["What's one way I can show up better as a friend?", "long"],
  "Fun and Interesting Questions": ["On a scale from 1 to 5, how spontaneous are you?", "rating"],
};

export function seedNotebook(account: Person): Notebook {
  const questions: Question[] = [
    { id: "memory", prompt: templates.Friendship[0], type: "long", required: true, options: [] },
    { id: "song", prompt: templates["Favourite Things"][0], type: "short", required: false, options: [] },
    { id: "outing", prompt: "What should we do together next?", type: "single", required: false, options: ["Coffee", "A hike", "A movie"] },
  ];
  const book: Book = {
    id: "old-times", ownerId: account.id, title: "For old times’ sake",
    description: "A few little things I’d love to remember about us.", questions, status: "ready",
  };
  const mayaBook: Book = {
    ...book, id: "slow-sunday", ownerId: "maya", title: "A slow Sunday together",
    description: "A few questions for catching up, even when life gets busy.",
  };
  return {
    books: [book, mayaBook, {
      ...book, id: "next-chapter", title: "Our next chapter", description: "Ideas for memories we haven’t made yet.", status: "draft", questions: [],
    }],
    invitations: [
      {
        id: "welcome", book: mayaBook, senderId: "maya", recipientId: account.id,
        message: "This made me think of our weekend coffee walks.",
        sentAt: new Date().toISOString(), status: "pending", answers: {},
      },
      {
        id: "keepsake", book, senderId: account.id, recipientId: "jordan",
        message: "Here’s a little trip down memory lane.",
        sentAt: new Date(Date.now() - 172800000).toISOString(),
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        status: "completed", answers: { memory: "Getting caught in the rain after the street festival and laughing the whole way home.", song: "September", outing: "Coffee" },
      },
    ],
  };
}

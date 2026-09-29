/**
 * Public website copy in one place, so every page tells the same story.
 * Keep claims truthful: examples are illustrative, nothing is guaranteed,
 * and nothing is binding until everyone signs.
 */

export type IconName =
  | "palette"
  | "mic"
  | "home"
  | "chart"
  | "leaf"
  | "wrench"
  | "coins"
  | "key"
  | "user"
  | "spark"
  | "handshake"
  | "blueprint"
  | "pen"
  | "building"
  | "shield"
  | "people";

export const TAGLINE = "Make. Create. Operate. Collaborate.";

export const STEPS = [
  {
    n: 1,
    name: "Qualify",
    icon: "user",
    title: "Create your account and show what you bring",
    short: "A free profile: your skills, talents, space, equipment, or capital.",
    body: "Sign up in a few minutes. Tell us who you are, what you can contribute, and the kinds of businesses you would like to be part of. A person reviews every profile.",
    you: "Create your free account and describe what you bring. It commits you to nothing.",
    us: "A person reviews your profile and emails you about next steps.",
  },
  {
    n: 2,
    name: "Discover",
    icon: "people",
    title: "Get matched and meet",
    short: "People whose strengths fit yours. Introductions only when everyone says yes.",
    body: "We look for members with shared interests and the pieces an idea is missing, then suggest a team and explain why each person fits. If everyone agrees, we introduce you.",
    you: "Review the match, decide whether to meet, and talk through ideas together.",
    us: "We suggest the team, make the introductions, and help the first conversations go well.",
  },
  {
    n: 3,
    name: "Diligence",
    icon: "shield",
    title: "Check the details",
    short: "Confirm what each person brings, before anyone commits.",
    body: "Everyone gets a clear picture: experience, time, space, equipment, licenses, and any money being contributed. Questions get answered now, not after signing.",
    you: "Share what's needed to back up your contribution, and ask the team anything.",
    us: "We organize the checklist and flag anything that needs a closer look.",
  },
  {
    n: 4,
    name: "Blueprint",
    icon: "blueprint",
    title: "Plan the business",
    short: "Agree on who does what, who owns what, and what comes first.",
    body: "Together we write a simple plan: what the business does, each person's role and contribution, how ownership and profits are shared, the budget, and the first milestones.",
    you: "Shape the plan and agree on your role and your share.",
    us: "We guide the plan and make sure nothing important is left out.",
  },
  {
    n: 5,
    name: "Assemble",
    icon: "pen",
    title: "Sign and form your LLC",
    short: "One agreement, signed through DocuSign, and a new LLC for your team.",
    body: "The plan becomes an operating agreement prepared with an attorney. Everyone reads it, can review it with their own adviser, and signs through DocuSign. Then the business is registered as its own LLC.",
    you: "Read, ask questions, and sign when you are comfortable.",
    us: "We coordinate the attorney, the signing, and the LLC filing. Nothing is binding until everyone signs.",
  },
  {
    n: 6,
    name: "Pilot",
    icon: "spark",
    title: "Test it small",
    short: "A first product, show, project, or season to prove it works.",
    body: "Before going big, the team runs a focused first test with clear goals: real customers, real costs, and real results to learn from.",
    you: "Do your part of the pilot and track how it goes.",
    us: "We help set the goals, watch the numbers, and run the review at the end.",
  },
  {
    n: 7,
    name: "Operate",
    icon: "building",
    title: "Run and grow the business",
    short: "Your team operates a business you own together.",
    body: "With the pilot behind you, the team runs the business under its agreement. Lofgren Enterprise stays on to help with operations, connections, and growth.",
    you: "Build the business with your team.",
    us: "We keep supporting the business as described in your agreement.",
  },
] as const satisfies readonly {
  n: number;
  name: string;
  icon: IconName;
  title: string;
  short: string;
  body: string;
  you: string;
  us: string;
}[];

export const CATEGORIES = [
  {
    slug: "visual-arts",
    icon: "palette",
    title: "Visual arts and crafts",
    body: "Artists and makers whose work could fill a gallery, a shop, or a studio.",
    examples: ["Photography", "Drawing", "Painting", "Ceramics", "Sculpture", "Printmaking", "Jewelry", "Woodworking"],
  },
  {
    slug: "performing-arts",
    icon: "mic",
    title: "Performing arts and media",
    body: "Performers and creators who could build a studio, events company, or production team.",
    examples: ["Dance", "Music", "Videography", "Acting", "Film editing", "Sound engineering", "Content creation", "Event hosting"],
  },
  {
    slug: "property-building",
    icon: "home",
    title: "Property and building",
    body: "People who find, build, fix, or manage places where business happens.",
    examples: ["Real estate", "Construction", "Interior design", "Architecture", "Property management", "Landscaping"],
  },
  {
    slug: "sales-business",
    icon: "chart",
    title: "Sales and business",
    body: "People who bring customers, organization, and numbers to a team.",
    examples: ["Sales", "Marketing", "Bookkeeping", "Operations", "Customer service", "E-commerce", "Management"],
  },
  {
    slug: "food-farming",
    icon: "leaf",
    title: "Food, farming, and products",
    body: "Growers, cooks, and producers with something people want to buy.",
    examples: ["Farming", "Baking", "Cooking", "Brewing", "Beekeeping", "Product making", "Packaging"],
  },
  {
    slug: "trades-technical",
    icon: "wrench",
    title: "Trades and technical skills",
    body: "Hands-on and technical experts who make things work.",
    examples: ["Electrical", "Plumbing", "Mechanics", "Software", "Web design", "IT support", "Manufacturing"],
  },
  {
    slug: "space-equipment",
    icon: "key",
    title: "Space, equipment, and assets",
    body: "Something a business needs that you already have.",
    examples: ["Storefront", "Warehouse", "Studio space", "Land", "Vehicles", "Tools and machinery", "Inventory"],
  },
  {
    slug: "capital",
    icon: "coins",
    title: "Capital",
    body: "Money to help a team get started, contributed only on terms an attorney has confirmed are allowed.",
    examples: ["Startup funds", "Equipment funding", "Working capital"],
  },
] as const satisfies readonly {
  slug: string;
  icon: IconName;
  title: string;
  body: string;
  examples: readonly string[];
}[];

export const EXAMPLES = [
  {
    title: "A local art gallery and shop",
    icon: "palette",
    summary: "Artists pool their work into one storefront that sells, hosts shows, and takes commissions.",
    team: [
      { role: "Photographer", brings: "Prints and portrait sessions" },
      { role: "Painter", brings: "Original work and classes" },
      { role: "Ceramicist", brings: "Functional pieces and workshops" },
      { role: "Building owner", brings: "Street-level retail space" },
      { role: "Sales lead", brings: "Pricing, online store, events" },
    ],
  },
  {
    title: "A media and events production company",
    icon: "mic",
    summary: "Performers and filmmakers team up to produce music videos, live shows, and brand content.",
    team: [
      { role: "Dancer and choreographer", brings: "Performance and direction" },
      { role: "Musician", brings: "Original music and sound" },
      { role: "Videographer", brings: "Filming and editing" },
      { role: "Actor", brings: "On-camera talent and scripts" },
      { role: "Event planner", brings: "Bookings and client relationships" },
    ],
  },
  {
    title: "A home renovation and rental business",
    icon: "home",
    summary: "Property skills come together to buy, renovate, and rent or sell homes.",
    team: [
      { role: "Real estate agent", brings: "Finding and valuing properties" },
      { role: "Contractor", brings: "Renovation and crews" },
      { role: "Interior designer", brings: "Layouts and finishes" },
      { role: "Capital partner", brings: "Funds for the first project" },
    ],
  },
  {
    title: "A farm-to-table food brand",
    icon: "leaf",
    summary: "A grower's harvest becomes packaged products sold at markets, shops, and online.",
    team: [
      { role: "Farmer", brings: "Produce and growing capacity" },
      { role: "Chef", brings: "Recipes and kitchen skills" },
      { role: "Designer", brings: "Brand and packaging" },
      { role: "Salesperson", brings: "Store and market accounts" },
    ],
  },
  {
    title: "A mobile repair and services company",
    icon: "wrench",
    summary: "Tradespeople share tools, a van, and a booking system to serve more customers together.",
    team: [
      { role: "Electrician", brings: "Licensed electrical work" },
      { role: "Plumber", brings: "Plumbing service calls" },
      { role: "Vehicle owner", brings: "Work van and tools" },
      { role: "Office manager", brings: "Scheduling and billing" },
    ],
  },
  {
    title: "An online product store",
    icon: "chart",
    summary: "A maker's products reach customers everywhere through a shared online shop.",
    team: [
      { role: "Product maker", brings: "Handmade inventory" },
      { role: "Web designer", brings: "Store and checkout" },
      { role: "Marketer", brings: "Social media and ads" },
      { role: "Warehouse owner", brings: "Storage and shipping space" },
    ],
  },
] as const satisfies readonly {
  title: string;
  icon: IconName;
  summary: string;
  team: readonly { role: string; brings: string }[];
}[];

export const PROMISES = [
  { icon: "user", title: "Free to join", body: "Creating an account and being matched costs nothing." },
  { icon: "handshake", title: "You choose", body: "You are only introduced when you agree, and you can say no at any step." },
  { icon: "pen", title: "Everything in writing", body: "Roles, ownership, and money are set out in one agreement before anything starts." },
  { icon: "building", title: "A business you own", body: "Each team forms its own LLC, with every member's share written into its agreement." },
] as const satisfies readonly { icon: IconName; title: string; body: string }[];

export const FAQ = [
  {
    q: "Who can create an account?",
    a: "Anyone 18 or older who wants to build a business with other people. You do not need a business idea, a degree, or money. A skill, a talent, experience, space, equipment, or capital are all welcome.",
  },
  {
    q: "Does it cost anything to join?",
    a: "No. Creating an account, completing your profile, and being matched are free. If you never form a business, you owe nothing.",
  },
  {
    q: "How does Lofgren Enterprise make money?",
    a: "When a team forms a business, Lofgren Enterprise may become a member of the new LLC or receive a fee for organizing it. The exact terms are written into the agreement, and you see them before anyone signs.",
  },
  {
    q: "How are matches made?",
    a: "A person on our team reviews your profile and looks for members whose skills and interests fit with yours. We explain why we think a team could work, and you decide whether to meet.",
  },
  {
    q: "What if I don't like a match?",
    a: "Say no. Introductions only happen when everyone agrees, and you can stop at any point before signing without any cost.",
  },
  {
    q: "Who decides the ownership split?",
    a: "The team does, together. We help you compare what each person contributes, such as time, skills, property, or money, and the split everyone agrees to goes into the written agreement.",
  },
  {
    q: "What is an LLC, and why form one?",
    a: "A limited liability company is a business registered with the state. It keeps the business separate from each member's personal finances and records who owns what. Each team gets its own LLC.",
  },
  {
    q: "What exactly do I sign?",
    a: "An operating agreement for your new LLC, prepared with an attorney. It lists every member, their role, their contribution, their ownership share, and how decisions and profits work. Everyone signs electronically through DocuSign.",
  },
  {
    q: "Can I have my own lawyer review the agreement?",
    a: "Yes, and we encourage it. Nothing is binding until every member signs, so take the time you need.",
  },
  {
    q: "Can I join if I only have money to contribute?",
    a: "You can create an account as a capital partner. Contributing money to a business can be treated as an investment under securities laws, so capital is only accepted on terms an attorney has confirmed are allowed. See the Capital partners page.",
  },
  {
    q: "What happens after the LLC is formed?",
    a: "Your team runs the business according to the plan. Lofgren Enterprise stays involved to help with operations, connections, and growth, as described in your agreement.",
  },
  {
    q: "Is my information private?",
    a: "Your profile is only shared with people you agree to meet. We never sell your information. See the privacy notice for details.",
  },
] as const;

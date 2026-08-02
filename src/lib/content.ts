export type Service = {
  name: string;
  blurb: string;
  price: string;
};

export const SERVICES: Service[] = [
  {
    name: "Oil & Fluid Service",
    blurb:
      "Full synthetic oil change plus multi-point fluid check, tuned to BMW/Audi/Mercedes service intervals.",
    price: "$150 – $250",
  },
  {
    name: "Brake Service",
    blurb: "OEM-spec pads, rotors, and fluid flush for import-grade stopping power.",
    price: "$400 – $850",
  },
  {
    name: "Diagnostics & Check Engine",
    blurb:
      "Dealer-level diagnostic scanning to find the real issue, not just clear the code.",
    price: "$180 – $260",
  },
  {
    name: "Suspension & Steering",
    blurb:
      "Control arms, bushings, and alignment work for the ride these cars were built for.",
    price: "$350 – $1,200",
  },
  {
    name: "Major Service Interval",
    blurb:
      "60k / 90k / 120k mile services done to factory spec, documented for resale.",
    price: "$600 – $1,500",
  },
  {
    name: "Pre-Purchase Inspection",
    blurb:
      "Buying used? A full inspection before you sign, so nothing surprises you later.",
    price: "$150 flat",
  },
];

export const TESTIMONIALS = [
  {
    name: "Dana R.",
    car: "BMW X5",
    quote: "They treated my X5 like it mattered. Every step explained, no upsell games.",
  },
  {
    name: "Marcus T.",
    car: "Audi Q7",
    quote: "Finally a shop that gets German cars. Diagnosis was spot-on the first time.",
  },
  {
    name: "Priya S.",
    car: "Mercedes C300",
    quote:
      "Fast, transparent pricing, and my C-Class runs better than when I bought it.",
  },
];

export const SERVICE_NAMES = SERVICES.map((s) => s.name);

export const MAKES = ["BMW", "Audi", "Mercedes-Benz", "Other"] as const;

export const TIME_SLOTS = [
  "Morning (8-11am)",
  "Midday (11am-2pm)",
  "Afternoon (2-5pm)",
] as const;

export const HOURS = {
  weekdays: "Mon – Fri: 8am – 6pm",
  saturday: "Saturday: 9am – 3pm",
  sunday: "Sunday: Closed",
};

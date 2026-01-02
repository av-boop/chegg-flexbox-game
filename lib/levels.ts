export interface Level {
  id: number
  description: string
  targetSelector: string
  solution: string
  students: Array<{
    color: string
    className?: string
    style?: Record<string, string>
  }>
  desks: Array<{
    color: string
    style?: Record<string, string>
  }>
  targetLayout: Record<string, string>
  properties?: Array<{
    name: string
    description: string
  }>
}

export const levels: Level[] = [
  {
    id: 1,
    description:
      "Welcome to Flexbox Classroom! Use the justify-content property to align the student to their desk. This property controls the horizontal alignment of items within a flex container.",
    targetSelector: "#student-container",
    solution: "justify-content: flex-end;",
    students: [{ color: "oklch(0.75 0.15 45)" }],
    desks: [{ color: "oklch(0.65 0.15 200)" }],
    targetLayout: {
      justifyContent: "flex-end",
    },
    properties: [
      { name: "flex-start", description: "Items align to the left side of the container" },
      { name: "flex-end", description: "Items align to the right side of the container" },
      { name: "center", description: "Items align at the center of the container" },
      { name: "space-between", description: "Items display with equal spacing between them" },
      { name: "space-around", description: "Items display with equal spacing around them" },
    ],
  },
  {
    id: 2,
    description:
      "Use justify-content to center the student horizontally. This property distributes space along the main axis (left to right).",
    targetSelector: "#student-container",
    solution: "justify-content: center;",
    students: [{ color: "oklch(0.75 0.15 50)" }],
    desks: [{ color: "oklch(0.65 0.15 205)" }],
    targetLayout: {
      justifyContent: "center",
    },
  },
  {
    id: 3,
    description: "Practice using justify-content again. Move the student to the left side where their desk is waiting.",
    targetSelector: "#student-container",
    solution: "justify-content: flex-start;",
    students: [{ color: "oklch(0.75 0.15 55)" }],
    desks: [{ color: "oklch(0.65 0.15 210)" }],
    targetLayout: {
      justifyContent: "flex-start",
    },
  },
  {
    id: 4,
    description:
      "Now with multiple students! Use justify-content: space-between to create equal spacing between items, pushing them to opposite ends.",
    targetSelector: "#student-container",
    solution: "justify-content: space-between;",
    students: [{ color: "oklch(0.75 0.15 40)" }, { color: "oklch(0.75 0.15 60)" }],
    desks: [{ color: "oklch(0.65 0.15 195)" }, { color: "oklch(0.65 0.15 215)" }],
    targetLayout: {
      justifyContent: "space-between",
    },
  },
  {
    id: 5,
    description:
      "Time for vertical alignment! Use align-items to control the vertical positioning of items within the container. Move students down to their desks.",
    targetSelector: "#student-container",
    solution: "align-items: flex-end;",
    students: [{ color: "oklch(0.75 0.15 45)" }, { color: "oklch(0.75 0.15 55)" }],
    desks: [{ color: "oklch(0.65 0.15 200)" }, { color: "oklch(0.65 0.15 210)" }],
    targetLayout: {
      alignItems: "flex-end",
    },
    properties: [
      { name: "flex-start", description: "Items align to the top of the container" },
      { name: "flex-end", description: "Items align to the bottom of the container" },
      { name: "center", description: "Items align at the vertical center of the container" },
      { name: "baseline", description: "Items align at their baseline" },
      { name: "stretch", description: "Items stretch to fill the container" },
    ],
  },
  {
    id: 6,
    description:
      "Combine justify-content and align-items to achieve perfect centering! Use both properties to center the student in both directions.",
    targetSelector: "#student-container",
    solution: "justify-content: center; align-items: center;",
    students: [{ color: "oklch(0.75 0.15 50)" }],
    desks: [{ color: "oklch(0.65 0.15 205)" }],
    targetLayout: {
      justifyContent: "center",
      alignItems: "center",
    },
  },
  {
    id: 7,
    description:
      "Try space-around! Unlike space-between, this value creates equal space around each item, including at the edges.",
    targetSelector: "#student-container",
    solution: "justify-content: space-around;",
    students: [{ color: "oklch(0.75 0.15 40)" }, { color: "oklch(0.75 0.15 50)" }, { color: "oklch(0.75 0.15 60)" }],
    desks: [{ color: "oklch(0.65 0.15 195)" }, { color: "oklch(0.65 0.15 205)" }, { color: "oklch(0.65 0.15 215)" }],
    targetLayout: {
      justifyContent: "space-around",
    },
  },
  {
    id: 8,
    description:
      "Change the flow direction! The flex-direction property controls whether items are arranged horizontally (row) or vertically (column). Change the layout to column.",
    targetSelector: "#student-container",
    solution: "flex-direction: column;",
    students: [{ color: "oklch(0.75 0.15 45)" }, { color: "oklch(0.75 0.15 55)" }],
    desks: [{ color: "oklch(0.65 0.15 200)" }, { color: "oklch(0.65 0.15 210)" }],
    targetLayout: {
      flexDirection: "column",
    },
    properties: [
      { name: "row", description: "Items are placed the same as the text direction" },
      { name: "row-reverse", description: "Items are placed opposite to the text direction" },
      { name: "column", description: "Items are placed top to bottom" },
      { name: "column-reverse", description: "Items are placed bottom to top" },
    ],
  },
  {
    id: 9,
    description:
      "Combine flex-direction and justify-content! When direction is column, justify-content controls vertical spacing instead of horizontal.",
    targetSelector: "#student-container",
    solution: "flex-direction: column; justify-content: center;",
    students: [{ color: "oklch(0.75 0.15 45)" }, { color: "oklch(0.75 0.15 55)" }],
    desks: [{ color: "oklch(0.65 0.15 200)" }, { color: "oklch(0.65 0.15 210)" }],
    targetLayout: {
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  {
    id: 10,
    description:
      "Too many students for one line! The flex-wrap property controls whether items stay in one line or wrap to multiple lines. Allow wrapping to create a second row.",
    targetSelector: "#student-container",
    solution: "flex-wrap: wrap;",
    students: [
      { color: "oklch(0.75 0.15 40)" },
      { color: "oklch(0.75 0.15 43)" },
      { color: "oklch(0.75 0.15 46)" },
      { color: "oklch(0.75 0.15 49)" },
      { color: "oklch(0.75 0.15 52)" },
      { color: "oklch(0.75 0.15 55)" },
      { color: "oklch(0.75 0.15 58)" },
      { color: "oklch(0.75 0.15 61)" },
      { color: "oklch(0.75 0.15 64)" },
      { color: "oklch(0.75 0.15 67)" },
    ],
    desks: [
      { color: "oklch(0.65 0.15 195)" },
      { color: "oklch(0.65 0.15 198)" },
      { color: "oklch(0.65 0.15 201)" },
      { color: "oklch(0.65 0.15 204)" },
      { color: "oklch(0.65 0.15 207)" },
      { color: "oklch(0.65 0.15 210)" },
      { color: "oklch(0.65 0.15 213)" },
      { color: "oklch(0.65 0.15 216)" },
      { color: "oklch(0.65 0.15 219)" },
      { color: "oklch(0.65 0.15 222)" },
    ],
    targetLayout: {
      flexWrap: "wrap",
    },
    properties: [
      { name: "nowrap", description: "Items will not wrap (default)" },
      { name: "wrap", description: "Items will wrap onto multiple lines" },
      { name: "wrap-reverse", description: "Items will wrap onto multiple lines in reverse order" },
    ],
  },
  {
    id: 11,
    description:
      "Master multi-line layouts! Combine flex-wrap with justify-content to control spacing across multiple rows.",
    targetSelector: "#student-container",
    solution: "flex-wrap: wrap; justify-content: space-between;",
    students: [
      { color: "oklch(0.75 0.15 40)" },
      { color: "oklch(0.75 0.15 43)" },
      { color: "oklch(0.75 0.15 46)" },
      { color: "oklch(0.75 0.15 49)" },
      { color: "oklch(0.75 0.15 52)" },
      { color: "oklch(0.75 0.15 55)" },
      { color: "oklch(0.75 0.15 58)" },
      { color: "oklch(0.75 0.15 61)" },
      { color: "oklch(0.75 0.15 64)" },
      { color: "oklch(0.75 0.15 67)" },
    ],
    desks: [
      { color: "oklch(0.65 0.15 195)" },
      { color: "oklch(0.65 0.15 198)" },
      { color: "oklch(0.65 0.15 201)" },
      { color: "oklch(0.65 0.15 204)" },
      { color: "oklch(0.65 0.15 207)" },
      { color: "oklch(0.65 0.15 210)" },
      { color: "oklch(0.65 0.15 213)" },
      { color: "oklch(0.65 0.15 216)" },
      { color: "oklch(0.65 0.15 219)" },
      { color: "oklch(0.65 0.15 222)" },
    ],
    targetLayout: {
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  },
  {
    id: 12,
    description:
      "Learn the flex shorthand property! This property is applied to individual flex items (not the container) and controls how they grow to fill available space. The value 'flex: 1' makes items grow equally to fill the container width. Apply it to each student to make them equal width.",
    targetSelector: ".student",
    solution: "flex: 1;",
    students: [{ color: "oklch(0.75 0.15 45)" }, { color: "oklch(0.75 0.15 52)" }, { color: "oklch(0.75 0.15 60)" }],
    desks: [
      { color: "oklch(0.65 0.15 200)", style: { flex: "1" } },
      { color: "oklch(0.65 0.15 207)", style: { flex: "1" } },
      { color: "oklch(0.65 0.15 215)", style: { flex: "1" } },
    ],
    targetLayout: {},
    properties: [
      { name: "flex: 0", description: "Item will not grow or shrink, maintains its natural size" },
      { name: "flex: 1", description: "Item will grow and shrink equally to fill space (shorthand for 1 1 0%)" },
      { name: "flex: 2", description: "Item will grow twice as much as items with flex: 1" },
      {
        name: "flex: auto",
        description: "Item will grow and shrink based on its content size (shorthand for 1 1 auto)",
      },
    ],
  },
]

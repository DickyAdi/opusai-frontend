const KnowledgeTypeEnum = {
  rule:'rule',
  document:'document',
  archive:'archive'
} as const

export type Knowledge = {
  name:string,
  type: typeof KnowledgeTypeEnum[keyof typeof KnowledgeTypeEnum]
}

export const dummyKnowledge:Knowledge[] = [
  {
    name: "Getting Started Guide",
    type: "document"
  },
  {
    name: "API Reference Documentation",
    type: "document"
  },
  {
    name: "User Authentication Best Practices",
    type: "rule"
  },
  {
    name: "Database Schema Overview",
    type: "document"
  },
  {
    name: "Deployment Guide for Production",
    type: "document"
  },
  {
    name: "Code Style Guidelines",
    type: "rule"
  },
  {
    name: "TypeScript Configuration Tutorial",
    type: "document"
  },
  {
    name: "Security Policy Requirements",
    type: "rule"
  },
  {
    name: "Performance Optimization Techniques",
    type: "document"
  },
  {
    name: "Testing Strategy Documentation",
    type: "document"
  },
  {
    name: "Q3 2024 Project Archive",
    type: "archive"
  },
  {
    name: "Error Handling Standards",
    type: "rule"
  },
  {
    name: "Code Review Checklist",
    type: "rule"
  },
  {
    name: "Mobile Responsive Design Guide",
    type: "document"
  },
  {
    name: "Accessibility Compliance Rules",
    type: "rule"
  },
  {
    name: "Legacy System Documentation",
    type: "archive"
  },
  {
    name: "Microservices Architecture Overview",
    type: "document"
  },
  {
    name: "GraphQL Query Examples",
    type: "document"
  },
  {
    name: "2023 Annual Reports",
    type: "archive"
  },
  {
    name: "Monitoring and Logging Setup",
    type: "document"
  }
]
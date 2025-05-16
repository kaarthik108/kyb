import { Platform } from "@/types/dashboard";

export const dashboardData = {
  brand_name: "Tesla",
  total_mentions: 18,
  overall_sentiment: {
    positive: 22.22,
    negative: 44.44,
    neutral: 33.33
  },
  platform_sentiment: {
    Twitter: {
      positive: 33.33,
      negative: 33.33,
      neutral: 33.33,
      count: 3
    },
    LinkedIn: {
      positive: 100,
      negative: 0,
      neutral: 0,
      count: 3
    },
    Reddit: {
      positive: 0,
      negative: 66.67,
      neutral: 33.33,
      count: 3
    },
    News: {
      positive: 0,
      negative: 50,
      neutral: 50,
      count: 6
    }
  },
  ethical_highlights: [
    "Market competition and sales performance challenges",
    "Sustainability and environmental responsibility issues",
    "Labor practices and workplace ethics controversies",
    "Product quality, customer service, and reliability concerns",
    "Corporate social responsibility including renewable energy initiatives",
    "Transparency issues and social controversies",
    "Innovation and technological leadership in automotive sector"
  ],
  word_cloud_themes: [
    { word: "sales", weight: 10 },
    { word: "Tesla", weight: 10 },
    { word: "United States", weight: 9 },
    { word: "automotive", weight: 8 },
    { word: "sustainability", weight: 8 },
    { word: "environment", weight: 7 },
    { word: "competition", weight: 7 },
    { word: "electric vehicles", weight: 7 },
    { word: "market", weight: 7 },
    { word: "Model Y", weight: 6 },
    { word: "Model 3", weight: 6 },
    { word: "production", weight: 6 },
    { word: "delivery", weight: 6 },
    { word: "financial results", weight: 6 },
    { word: "innovation", weight: 6 },
    { word: "customer service", weight: 6 },
    { word: "product quality", weight: 6 },
    { word: "labor practices", weight: 6 },
    { word: "racial harassment", weight: 5 },
    { word: "transparency", weight: 5 },
    { word: "corporate social responsibility", weight: 5 },
    { word: "technology", weight: 5 },
    { word: "leadership", weight: 5 },
    { word: "market share", weight: 5 },
    { word: "environmental impact", weight: 5 },
    { word: "ethics", weight: 5 },
    { word: "controversies", weight: 5 },
    { word: "stock price", weight: 5 },
    { word: "renewable energy", weight: 5 },
    { word: "transitions", weight: 4 }
  ],
  platforms: [
    {
      name: "Twitter",
      mentions: [
        {
          platform: "Twitter",
          date: "2025-04-11",
          text: "Tesla's sales in the United States fell almost 9 percent in the first three months of the year even as the overall market for electric vehicles grew. Competitors like GM and Ford are making gains while Tesla faces challenges with its aging lineup.",
          sentiment: "negative",
          ethical_context: "Market competition and company sales performance",
          url: "https://twitter.com/search?q=Tesla%20sales%20US%202025"
        },
        {
          platform: "Twitter",
          date: "2025-01-29",
          text: "Tesla released its financial results for the fourth quarter and full year 2024. Despite production and delivery records, global sales fell in 2024, breaking a 12-year streak. The company also launched new Model 3 Performance trim leveraging new engineering capabilities.",
          sentiment: "neutral",
          ethical_context: "Company financial results and product update",
          url: "https://twitter.com/search?q=Tesla%20Q4%202024%20financial%20results"
        },
        {
          platform: "Twitter",
          date: "2024-12-15",
          text: "Tesla continues to rank first in the Made in America Auto Index for 2024, capturing the top three spots. This highlights Tesla's increasing domestic manufacturing footprint and contribution to the US automotive industry.",
          sentiment: "positive",
          ethical_context: "Sustainability and local manufacturing",
          url: "https://twitter.com/search?q=Tesla%20Made%20in%20America%202024"
        }
      ]
    },
    {
      name: "LinkedIn",
      mentions: [
        {
          platform: "LinkedIn",
          date: "2024-05-10",
          text: "Excited to see Tesla leading the way in automotive innovation in the United States! Their latest update on battery technology is a game-changer for sustainable transportation.",
          sentiment: "positive",
          ethical_context: "Sustainability and technological innovation in the automotive industry",
          url: "https://www.linkedin.com/company/tesla"
        },
        {
          platform: "LinkedIn",
          date: "2024-04-30",
          text: "Tesla's commitment to renewable energy and sustainability initiatives in the US market continues to set industry standards. Recently announced new solar projects will boost clean energy adoption nationwide.",
          sentiment: "positive",
          ethical_context: "Corporate sustainability initiatives and renewable energy",
          url: "https://www.linkedin.com/posts/tesla-clean-energy-updates-activity-7012345678901234567"
        },
        {
          platform: "LinkedIn",
          date: "2024-05-08",
          text: "Interesting insights from Tesla's leadership on the future of autonomous vehicles in the US automotive sector. Their advancements promise safer roads and enhanced mobility options.",
          sentiment: "positive",
          ethical_context: "Leadership in autonomous vehicle technology and future mobility",
          url: "https://www.linkedin.com/posts/tesla-ceo-interview-autonomous-driving-activity-7013456789012345678"
        }
      ]
    },
    {
      name: "Reddit",
      mentions: [
        {
          platform: "Reddit",
          date: "2024-05-01",
          text: "Tesla has always been treated more like a tech disruptor than your average car company. But slumping sales, a fluctuating stock price, and Elon Musk's recent controversies have led many in r/RealTesla to discuss whether the brand can sustain its hype. Issues raised include build quality concerns, delayed projects, and executive decisions.",
          sentiment: "negative",
          ethical_context: "Business challenges and controversies surrounding company leadership, product reliability, and market perception.",
          url: "https://www.reddit.com/r/RealTesla/comments/1jl6i0o/the_verge_teslas_problems_are_bigger_than_just/"
        },
        {
          platform: "Reddit",
          date: "2024-04-20",
          text: "Had multiple issues with my new Tesla Model Y: paint defects, GPS and cameras malfunctioning right off the bat. Service has been slow but some fixes are underway. Lots of discussion on r/electricvehicles about Tesla's service quality and customer support struggles.",
          sentiment: "negative",
          ethical_context: "Customer service and product quality concerns amidst growing demand for electric vehicles.",
          url: "https://www.reddit.com/r/electricvehicles/comments/1irryus/tesla_model_y_everything_is_apparently_wear_and/"
        },
        {
          platform: "Reddit",
          date: "2024-03-18",
          text: "Discussion about Tesla's environmental impact in r/sustainability shows mixed opinions. Some highlight the lower lifetime emissions of Teslas compared to gas cars, while others criticize battery production and resource extraction as problematic. The overall sentiment balances Tesla's innovation with challenges in ecological footprint and sustainability ethics.",
          sentiment: "neutral",
          ethical_context: "Environmental impact debate focusing on sustainability, battery production, and lifecycle emissions.",
          url: "https://www.reddit.com/r/sustainability/comments/doukp4/tesla_cars_actually_better_for_the_planet/"
        }
      ]
    },
    {
      name: "News",
      mentions: [
        {
          platform: "News",
          date: "2025-04-11",
          text: "Tesla's sales in the United States fell almost 9 percent in the first three months of the year even as the overall market for electric vehicles grew, signaling increased competition from other automakers like GM, Ford, and Volkswagen.",
          sentiment: "negative",
          ethical_context: "Market competition and business performance in automotive industry",
          url: "https://www.nytimes.com/2025/04/11/business/tesla-sales-elon-musk.html"
        },
        {
          platform: "News",
          date: "2025-03-12",
          text: "Tesla's new US registrations fell 11 percent in January 2025, while rival electric vehicle makers experienced a 44 percent surge, led by brands such as Ford, Chevrolet, and Volkswagen.",
          sentiment: "negative",
          ethical_context: "Sales performance and competitive landscape in US electric vehicle market",
          url: "https://www.autonews.com/tesla/an-tesla-us-sales-fall-as-evs-rise-overall-0312/"
        },
        {
          platform: "News",
          date: "2025-05-13",
          text: "Tesla has started a refresh update on its best-selling Model Y SUV, but the rollout has encountered some issues causing a rocky start. The update is important as Tesla tries to maintain its lead in the competitive US automotive market.",
          sentiment: "neutral",
          ethical_context: "Product update and innovation challenges in automotive industry",
          url: "https://www.reuters.com/business/autos-transportation/teslas-refresh-best-selling-model-y-suv-starts-rocky-road-2025-05-13/"
        },
        {
          platform: "News",
          date: "2025-01-29",
          text: "Tesla posted a rare earnings miss for the last quarter of 2024, with earnings per share below expectations amid weak sales and revenue, leading to thinning profit margins.",
          sentiment: "negative",
          ethical_context: "Financial performance and market expectations",
          url: "https://www.cnn.com/2025/01/29/business/tesla-earnings"
        },
        {
          platform: "News",
          date: "2024-11-19",
          text: "Tesla's sustainability efforts have been described as inconsistent, with some positive initiatives but also criticism over transparency issues and environmental practices, highlighting the challenges Tesla faces balancing growth with corporate responsibility.",
          sentiment: "neutral",
          ethical_context: "Sustainability and environmental responsibility challenges",
          url: "https://karmawallet.io/blog/2024/11/teslas-sustainability-the-good-the-bad/"
        },
        {
          platform: "News",
          date: "2024-09-28",
          text: "The U.S. Equal Employment Opportunity Commission (EEOC) sued Tesla for tolerating widespread racial harassment and retaliation against Black employees, marking a significant legal and ethical challenge for the company in its labor practices.",
          sentiment: "negative",
          ethical_context: "Labor practices and workplace ethics controversy",
          url: "https://www.eeoc.gov/newsroom/eeoc-sues-tesla-racial-harassment-and-retaliation"
        }
      ]
    }
  ]
};
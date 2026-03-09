// Realistic mock data for demo mode
// These represent actual pain points one might find on Reddit

export const MOCK_PAIN_POINTS = [
    {
        id: "pp-001",
        title: "No affordable CRM for solo founders",
        description: "Solo founders and indie hackers repeatedly express frustration that most CRMs are designed for teams of 10+. They need simple contact tracking with deal stages but don't want to pay $50/seat/month for features they'll never use. Many resort to spreadsheets instead.",
        category: "Pricing",
        trending_score: 47.25,
        mention_count: 23,
        avg_upvotes: 142,
        avg_comments: 67,
        subreddit: "SaaS",
        willingness_to_pay_score: 8,
        created_at: "2026-02-28T14:22:00Z",
        last_seen: "2026-03-07T09:15:00Z",
        source_links: [
            "https://reddit.com/r/SaaS/comments/abc123/frustrated_with_crm_pricing",
            "https://reddit.com/r/startups/comments/def456/solo_founder_crm_options"
        ]
    },
    {
        id: "pp-002",
        title: "AI meeting notes lose context and action items",
        description: "Users of AI meeting transcription tools complain that while the transcription is good, the generated summaries miss nuance and action items. They wish there was a tool that could understand project context and automatically create tasks in their PM tool.",
        category: "User Experience",
        trending_score: 42.80,
        mention_count: 18,
        avg_upvotes: 235,
        avg_comments: 89,
        subreddit: "aiautomation",
        willingness_to_pay_score: 9,
        created_at: "2026-03-01T10:30:00Z",
        last_seen: "2026-03-08T16:45:00Z",
        source_links: [
            "https://reddit.com/r/aiautomation/comments/ghi789/ai_meeting_notes_suck"
        ]
    },
    {
        id: "pp-003",
        title: "Property managers can't automate tenant screening",
        description: "Small property managers (5-20 units) are struggling with tenant screening. Enterprise tools are too expensive, while free ones don't integrate with their listing platforms. They need an affordable solution that pulls credit, criminal, and eviction data in one place.",
        category: "Integrations",
        trending_score: 38.90,
        mention_count: 15,
        avg_upvotes: 98,
        avg_comments: 54,
        subreddit: "realestate",
        willingness_to_pay_score: 7,
        created_at: "2026-02-25T08:15:00Z",
        last_seen: "2026-03-06T14:20:00Z",
        source_links: [
            "https://reddit.com/r/realestate/comments/jkl012/tenant_screening_automation",
            "https://reddit.com/r/homeowners/comments/mno345/landlord_tenant_screening"
        ]
    },
    {
        id: "pp-004",
        title: "n8n workflow debugging is incredibly painful",
        description: "n8n users love the tool but find debugging complex workflows nearly impossible. Error messages are vague, there's no step-by-step debugger, and when a workflow fails at 3AM, they have no idea which node caused the issue or what data it received.",
        category: "Technical Issues",
        trending_score: 36.15,
        mention_count: 31,
        avg_upvotes: 187,
        avg_comments: 112,
        subreddit: "n8n_ai_agents",
        willingness_to_pay_score: 6,
        created_at: "2026-03-03T19:00:00Z",
        last_seen: "2026-03-08T11:30:00Z",
        source_links: [
            "https://reddit.com/r/n8n_ai_agents/comments/pqr678/debugging_workflows"
        ]
    },
    {
        id: "pp-005",
        title: "Side hustlers need invoicing that doesn't look cheap",
        description: "People running side hustles want professional invoicing but QuickBooks and FreshBooks feel like overkill. They want something that generates beautiful branded invoices, tracks payments, and sends reminders — without the accounting overhead.",
        category: "Product-Market Fit",
        trending_score: 34.60,
        mention_count: 12,
        avg_upvotes: 76,
        avg_comments: 43,
        subreddit: "sidehustle",
        willingness_to_pay_score: 7,
        created_at: "2026-02-20T12:00:00Z",
        last_seen: "2026-03-05T18:30:00Z",
        source_links: [
            "https://reddit.com/r/sidehustle/comments/stu901/invoicing_for_freelancers"
        ]
    },
    {
        id: "pp-006",
        title: "Competitor analysis takes 20+ hours manually",
        description: "Startup founders spend entire weekends manually tracking competitor pricing, features, and positioning changes. They wish there was a tool that would automatically monitor competitor websites and alert them to changes in pricing pages, feature lists, and messaging.",
        category: "Competition",
        trending_score: 33.45,
        mention_count: 9,
        avg_upvotes: 312,
        avg_comments: 78,
        subreddit: "startups",
        willingness_to_pay_score: 8,
        created_at: "2026-03-02T15:45:00Z",
        last_seen: "2026-03-07T20:00:00Z",
        source_links: [
            "https://reddit.com/r/startups/comments/vwx234/competitor_monitoring_tools",
            "https://reddit.com/r/Entrepreneur/comments/yza567/tracking_competitors"
        ]
    },
    {
        id: "pp-007",
        title: "SaaS onboarding flows confuse more than help",
        description: "Users report that many SaaS products have onboarding flows that are either too long, ask irrelevant questions, or dump you into an empty dashboard with no guidance. The best experiences let you see value in under 2 minutes with real data.",
        category: "Onboarding",
        trending_score: 31.20,
        mention_count: 14,
        avg_upvotes: 167,
        avg_comments: 91,
        subreddit: "SaaS",
        willingness_to_pay_score: 4,
        created_at: "2026-02-18T09:30:00Z",
        last_seen: "2026-03-04T13:15:00Z",
        source_links: [
            "https://reddit.com/r/SaaS/comments/bcd890/worst_onboarding_experiences"
        ]
    },
    {
        id: "pp-008",
        title: "Home renovation cost estimator tools are wildly inaccurate",
        description: "Homeowners trying to budget for renovations find online cost estimators off by 50-100%. They need location-specific pricing with material breakdowns. Contractors won't give estimates without site visits, creating a chicken-and-egg problem.",
        category: "Ease of Use",
        trending_score: 29.85,
        mention_count: 8,
        avg_upvotes: 89,
        avg_comments: 134,
        subreddit: "homeowners",
        willingness_to_pay_score: 6,
        created_at: "2026-02-22T16:00:00Z",
        last_seen: "2026-03-03T10:45:00Z",
        source_links: [
            "https://reddit.com/r/homeowners/comments/efg123/renovation_cost_tools"
        ]
    },
    {
        id: "pp-009",
        title: "No good way to validate SaaS ideas before building",
        description: "Aspiring SaaS founders keep building first and validating later, wasting months. They want a structured framework tool that helps them validate demand — find pain points, measure willingness to pay, estimate TAM — before writing any code.",
        category: "Product-Market Fit",
        trending_score: 28.50,
        mention_count: 19,
        avg_upvotes: 256,
        avg_comments: 145,
        subreddit: "Entrepreneur",
        willingness_to_pay_score: 5,
        created_at: "2026-02-15T11:20:00Z",
        last_seen: "2026-03-06T08:00:00Z",
        source_links: [
            "https://reddit.com/r/Entrepreneur/comments/hij456/validating_saas_ideas",
            "https://reddit.com/r/startups/comments/klm789/idea_validation_framework"
        ]
    },
    {
        id: "pp-010",
        title: "Zapier is getting too expensive for small businesses",
        description: "Small business owners who relied on Zapier for automation are seeing costs balloon to $100+/month as they grow. They need essential integrations (Gmail → CRM → Slack) but can't justify enterprise automation pricing for 3-person teams.",
        category: "Pricing",
        trending_score: 27.10,
        mention_count: 27,
        avg_upvotes: 198,
        avg_comments: 67,
        subreddit: "Entrepreneur",
        willingness_to_pay_score: 9,
        created_at: "2026-03-04T07:30:00Z",
        last_seen: "2026-03-08T19:00:00Z",
        source_links: [
            "https://reddit.com/r/Entrepreneur/comments/nop012/zapier_alternatives_2026"
        ]
    },
    {
        id: "pp-011",
        title: "AI chatbots still can't handle multi-step customer queries",
        description: "Business owners deploying AI chatbots find they break down on any query requiring more than one step. Customer asks to 'change my plan and update billing' and the bot handles the first part but forgets the second. Customers end up frustrated and calling support anyway.",
        category: "Technical Issues",
        trending_score: 25.40,
        mention_count: 11,
        avg_upvotes: 124,
        avg_comments: 56,
        subreddit: "businessowners",
        willingness_to_pay_score: 7,
        created_at: "2026-02-27T13:45:00Z",
        last_seen: "2026-03-05T22:10:00Z",
        source_links: [
            "https://reddit.com/r/businessowners/comments/qrs345/ai_chatbot_complaints"
        ]
    },
    {
        id: "pp-012",
        title: "Need a simple dashboard for my side project metrics",
        description: "Indie developers want to see their key metrics (MRR, signups, churn) in one dashboard without setting up Mixpanel or Amplitude. They want something that takes 5 minutes to set up with a simple JavaScript snippet and shows beautiful charts.",
        category: "Ease of Use",
        trending_score: 24.30,
        mention_count: 16,
        avg_upvotes: 143,
        avg_comments: 72,
        subreddit: "sidehustle",
        willingness_to_pay_score: 6,
        created_at: "2026-02-19T20:15:00Z",
        last_seen: "2026-03-02T16:30:00Z",
        source_links: [
            "https://reddit.com/r/sidehustle/comments/tuv678/simple_analytics_dashboard"
        ]
    },
    {
        id: "pp-013",
        title: "Content repurposing across platforms is tedious",
        description: "Founders creating content struggle to repurpose a blog post into Twitter threads, LinkedIn posts, newsletter snippets, and YouTube scripts. Each platform has different formats and character limits. They want AI that understands their brand voice across all platforms.",
        category: "User Experience",
        trending_score: 22.85,
        mention_count: 13,
        avg_upvotes: 87,
        avg_comments: 39,
        subreddit: "Entrepreneur",
        willingness_to_pay_score: 5,
        created_at: "2026-02-24T14:00:00Z",
        last_seen: "2026-03-04T09:45:00Z",
        source_links: [
            "https://reddit.com/r/Entrepreneur/comments/wxy901/content_repurposing_tools"
        ]
    },
    {
        id: "pp-014",
        title: "Bookkeeping for rental properties is a nightmare",
        description: "Small landlords with 3-10 properties find bookkeeping incredibly complex. They need to track income/expenses per property, handle security deposits, generate tax reports, and categorize repairs vs improvements. QuickBooks isn't designed for real estate.",
        category: "Product-Market Fit",
        trending_score: 21.60,
        mention_count: 7,
        avg_upvotes: 65,
        avg_comments: 48,
        subreddit: "realestate",
        willingness_to_pay_score: 8,
        created_at: "2026-02-16T11:30:00Z",
        last_seen: "2026-03-01T14:00:00Z",
        source_links: [
            "https://reddit.com/r/realestate/comments/zab234/rental_bookkeeping_software"
        ]
    },
    {
        id: "pp-015",
        title: "Can't find a simple tool to collect customer testimonials",
        description: "SaaS founders know testimonials convert but collecting them is awkward. They want a tool that sends a beautiful link to happy customers, captures video or text testimonials, and lets them embed a social-proof wall on their website with zero code.",
        category: "Integrations",
        trending_score: 19.75,
        mention_count: 10,
        avg_upvotes: 112,
        avg_comments: 34,
        subreddit: "SaaS",
        willingness_to_pay_score: 6,
        created_at: "2026-03-05T16:20:00Z",
        last_seen: "2026-03-08T12:00:00Z",
        source_links: [
            "https://reddit.com/r/SaaS/comments/cde567/testimonial_collection_tools"
        ]
    },
    {
        id: "pp-016",
        title: "AI automation workflows break silently overnight",
        description: "Businesses relying on AI-powered automations discover failures only when customers complain. Workflows that worked yesterday break because an API changed, a prompt drifted, or a token limit was hit. They need proactive monitoring and alerting for AI pipelines.",
        category: "Technical Issues",
        trending_score: 18.30,
        mention_count: 8,
        avg_upvotes: 156,
        avg_comments: 62,
        subreddit: "aiautomation",
        willingness_to_pay_score: 7,
        created_at: "2026-03-06T22:00:00Z",
        last_seen: "2026-03-08T18:15:00Z",
        source_links: [
            "https://reddit.com/r/aiautomation/comments/fgh890/monitoring_ai_workflows"
        ]
    }
];

export const CATEGORIES = [
    'All Categories',
    'Product-Market Fit',
    'User Experience',
    'Pricing',
    'Competition',
    'Ease of Use',
    'Technical Issues',
    'Integrations',
    'Onboarding',
    'Customer Support'
];

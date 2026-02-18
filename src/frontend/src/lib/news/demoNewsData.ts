/**
 * Demo/placeholder news data for development and testing.
 * Provides deterministic sample news items for all regions.
 */

interface DemoNewsItem {
  headline: string;
  preview: string;
}

type RegionId = 'israel' | 'dubai' | 'india' | 'westbengal';

const DEMO_NEWS_DATA: Record<RegionId, DemoNewsItem[]> = {
  israel: [
    {
      headline: 'Tech Innovation Hub Expands in Tel Aviv',
      preview: 'New startup accelerator program launches with focus on AI and cybersecurity, attracting international investors and talent to the region.',
    },
    {
      headline: 'Archaeological Discovery Sheds Light on Ancient History',
      preview: 'Researchers uncover artifacts dating back thousands of years, providing new insights into early civilizations in the region.',
    },
    {
      headline: 'Renewable Energy Projects Gain Momentum',
      preview: 'Solar power initiatives expand across the country as part of ambitious sustainability goals for the coming decade.',
    },
    {
      headline: 'Cultural Festival Celebrates Diverse Heritage',
      preview: 'Annual event brings together communities from various backgrounds to share traditions, music, and cuisine.',
    },
    {
      headline: 'Education Reform Introduces New STEM Programs',
      preview: 'Schools implement innovative curriculum focusing on science, technology, engineering, and mathematics to prepare students for future careers.',
    },
    {
      headline: 'Transportation Infrastructure Receives Major Upgrade',
      preview: 'New rail lines and improved public transit systems aim to reduce congestion and improve connectivity across major cities.',
    },
    {
      headline: 'Healthcare System Adopts Digital Health Solutions',
      preview: 'Hospitals and clinics integrate telemedicine and electronic health records to enhance patient care and accessibility.',
    },
    {
      headline: 'Tourism Industry Shows Strong Recovery',
      preview: 'Visitor numbers reach new highs as international travelers return to explore historical sites and natural attractions.',
    },
    {
      headline: 'Environmental Conservation Efforts Expand',
      preview: 'New protected areas established to preserve biodiversity and natural habitats for future generations.',
    },
    {
      headline: 'Sports Teams Achieve International Recognition',
      preview: 'Local athletes compete successfully on the global stage, bringing pride and inspiration to communities nationwide.',
    },
  ],
  dubai: [
    {
      headline: 'Futuristic Skyscraper Project Unveiled',
      preview: 'Architectural marvel set to become the tallest building in the region, featuring sustainable design and cutting-edge technology.',
    },
    {
      headline: 'International Business Summit Attracts Global Leaders',
      preview: 'Major economic forum brings together CEOs and policymakers to discuss trade, innovation, and regional development.',
    },
    {
      headline: 'Luxury Shopping District Opens New Wing',
      preview: 'Expanded retail space features high-end brands and entertainment venues, enhancing the city\'s reputation as a shopping destination.',
    },
    {
      headline: 'Smart City Initiatives Transform Urban Living',
      preview: 'Advanced technology integration improves traffic management, energy efficiency, and quality of life for residents.',
    },
    {
      headline: 'Cultural Center Showcases Regional Art and History',
      preview: 'New museum opens with exhibits celebrating traditional crafts, contemporary art, and the emirate\'s rich heritage.',
    },
    {
      headline: 'Aviation Hub Expands with New Terminal',
      preview: 'Airport upgrades increase capacity and enhance passenger experience, reinforcing position as global travel hub.',
    },
    {
      headline: 'Hospitality Sector Launches Innovative Concepts',
      preview: 'Unique hotel experiences and dining venues attract tourists seeking luxury and adventure in the desert metropolis.',
    },
    {
      headline: 'Financial District Welcomes International Banks',
      preview: 'Growing financial services sector strengthens the city\'s role as a major center for banking and investment.',
    },
    {
      headline: 'Entertainment Complex Features World-Class Attractions',
      preview: 'Theme parks and performance venues offer diverse entertainment options for families and visitors from around the world.',
    },
    {
      headline: 'Sustainability Goals Drive Green Building Standards',
      preview: 'New regulations promote eco-friendly construction practices and renewable energy adoption across development projects.',
    },
  ],
  india: [
    {
      headline: 'Digital Payment Revolution Transforms Economy',
      preview: 'Mobile payment platforms reach millions of users, enabling financial inclusion and boosting small business growth nationwide.',
    },
    {
      headline: 'Space Program Achieves Historic Milestone',
      preview: 'Successful satellite launch demonstrates technological capabilities and advances scientific research objectives.',
    },
    {
      headline: 'Film Industry Celebrates Record-Breaking Productions',
      preview: 'Bollywood releases captivate audiences globally, showcasing diverse storytelling and cultural narratives.',
    },
    {
      headline: 'Agricultural Innovation Improves Crop Yields',
      preview: 'Farmers adopt modern techniques and technology to enhance productivity and sustainability in rural communities.',
    },
    {
      headline: 'Metro Expansion Connects Major Urban Centers',
      preview: 'New rail lines reduce commute times and provide affordable transportation options for millions of daily travelers.',
    },
    {
      headline: 'Tech Startups Attract Venture Capital Investment',
      preview: 'Entrepreneurial ecosystem flourishes as innovative companies develop solutions for local and global markets.',
    },
    {
      headline: 'Traditional Festivals Draw International Visitors',
      preview: 'Colorful celebrations showcase rich cultural heritage and attract tourists eager to experience authentic traditions.',
    },
    {
      headline: 'Renewable Energy Capacity Reaches New Heights',
      preview: 'Solar and wind power projects contribute to ambitious clean energy targets and reduce carbon emissions.',
    },
    {
      headline: 'Education Initiatives Focus on Digital Literacy',
      preview: 'Programs equip students with technology skills essential for success in the modern workforce.',
    },
    {
      headline: 'Wildlife Conservation Projects Protect Endangered Species',
      preview: 'Dedicated efforts preserve natural habitats and support biodiversity across diverse ecosystems.',
    },
  ],
  westbengal: [
    {
      headline: 'Literary Festival Honors Regional Writers',
      preview: 'Annual event celebrates the state\'s rich literary tradition and promotes contemporary authors and poets.',
    },
    {
      headline: 'Heritage Sites Undergo Restoration Projects',
      preview: 'Historical landmarks receive careful preservation work to maintain cultural treasures for future generations.',
    },
    {
      headline: 'Handicraft Industry Gains Global Recognition',
      preview: 'Traditional artisans showcase unique crafts at international exhibitions, boosting exports and cultural exchange.',
    },
    {
      headline: 'Educational Institutions Expand Research Programs',
      preview: 'Universities strengthen academic offerings and collaborate on innovative research in science and humanities.',
    },
    {
      headline: 'Tea Industry Adopts Sustainable Practices',
      preview: 'Plantations implement eco-friendly methods to preserve quality while protecting the environment.',
    },
    {
      headline: 'Cultural Performances Attract Theater Enthusiasts',
      preview: 'Traditional and contemporary productions showcase the region\'s vibrant performing arts scene.',
    },
    {
      headline: 'Urban Development Projects Improve Infrastructure',
      preview: 'New roads, bridges, and public facilities enhance connectivity and quality of life in growing cities.',
    },
    {
      headline: 'Food Tourism Highlights Regional Cuisine',
      preview: 'Culinary traditions draw food lovers eager to experience authentic flavors and cooking techniques.',
    },
    {
      headline: 'Sports Academies Nurture Young Talent',
      preview: 'Training programs develop athletes in cricket, football, and other sports, fostering competitive excellence.',
    },
    {
      headline: 'Environmental Initiatives Address Urban Challenges',
      preview: 'Community-led projects tackle pollution and promote green spaces in densely populated areas.',
    },
  ],
};

export function getDemoNewsForRegion(regionId: RegionId): DemoNewsItem[] {
  return DEMO_NEWS_DATA[regionId] || [];
}

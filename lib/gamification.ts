import { supabase } from './supabase';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'products' | 'referrals' | 'savings';
    count: number;
  };
}

export const badges: Badge[] = [
  {
    id: 'tracker-novice',
    name: 'Tracker Novice',
    description: 'Track your first product',
    icon: '🎯',
    requirement: { type: 'products', count: 1 },
  },
  {
    id: 'tracker-pro',
    name: 'Tracker Pro',
    description: 'Track 10 products simultaneously',
    icon: '🏆',
    requirement: { type: 'products', count: 10 },
  },
  {
    id: 'super-saver',
    name: 'Super Saver',
    description: 'Save $100 through price drops',
    icon: '💰',
    requirement: { type: 'savings', count: 100 },
  },
  {
    id: 'referral-master',
    name: 'Referral Master',
    description: 'Refer 5 friends who sign up',
    icon: '🤝',
    requirement: { type: 'referrals', count: 5 },
  },
];

export async function checkAndAwardBadges(userId: string) {
  try {
    // Get user's current stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;

    // Get user's current badges
    const { data: userBadges, error: badgesError } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    if (badgesError) throw badgesError;

    const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
    const newBadges: Badge[] = [];

    // Check each badge
    for (const badge of badges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      let qualified = false;
      switch (badge.requirement.type) {
        case 'products':
          qualified = stats.tracked_products >= badge.requirement.count;
          break;
        case 'referrals':
          qualified = stats.successful_referrals >= badge.requirement.count;
          break;
        case 'savings':
          qualified = stats.total_savings >= badge.requirement.count;
          break;
      }

      if (qualified) {
        // Award the badge
        const { error } = await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_id: badge.id,
            awarded_at: new Date().toISOString(),
          });

        if (!error) {
          newBadges.push(badge);
        }
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
}
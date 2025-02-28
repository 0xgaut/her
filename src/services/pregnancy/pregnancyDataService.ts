import { PregnancyMilestone } from '../../types';
import { differenceInWeeks, parseISO } from 'date-fns';

class PregnancyDataService {
  calculateWeekOfPregnancy(lastPeriodDate: string): number {
    const startDate = parseISO(lastPeriodDate);
    const today = new Date();
    const weeks = differenceInWeeks(today, startDate);
    return Math.min(Math.max(1, weeks), 42); // Clamp between 1-42 weeks
  }

  getMilestoneForWeek(week: number): PregnancyMilestone | null {
    if (week < 1 || week > 42) return null;
    
    // This would typically come from a database or API
    // Simplified example for week 12
    if (week === 12) {
      return {
        week: 12,
        title: "End of First Trimester",
        description: "Your baby is now about the size of a lime. The most critical development has taken place, and the risk of miscarriage drops significantly.",
        babySize: "Lime",
        babyWeight: "14 grams",
        babyLength: "5.4 cm",
        tips: [
          "Schedule your second-trimester prenatal appointments",
          "Consider starting prenatal yoga",
          "Begin planning your maternity leave"
        ],
        symptoms: [
          "Morning sickness may begin to subside",
          "Visible bump may start to show",
          "Increased energy levels"
        ]
      };
    }
    
    // Default milestone with basic information
    return {
      week,
      title: `Week ${week}`,
      description: "Your pregnancy is progressing. Consult your healthcare provider for specific information about this stage.",
      babySize: "Unknown",
      tips: ["Stay hydrated", "Take your prenatal vitamins", "Get regular exercise"],
      symptoms: ["Varies by individual"]
    };
  }

  getRecommendedTests(week: number): string[] {
    // Return recommended tests based on pregnancy week
    if (week <= 8) {
      return [
        "Blood type and Rh factor",
        "Complete blood count (CBC)",
        "Urine test",
        "Initial ultrasound"
      ];
    } else if (week <= 13) {
      return [
        "First-trimester screening",
        "Cell-free DNA screening (NIPT)",
        "Chorionic villus sampling (CVS) if recommended"
      ];
    } else if (week <= 20) {
      return [
        "Quad screen",
        "Anatomy ultrasound",
        "Amniocentesis if recommended"
      ];
    } else if (week <= 28) {
      return [
        "Glucose challenge test",
        "Antibody screen"
      ];
    } else {
      return [
        "Group B strep test",
        "Regular monitoring of baby's position",
        "Non-stress test if recommended"
      ];
    }
  }
}

export const pregnancyDataService = new PregnancyDataService(); 
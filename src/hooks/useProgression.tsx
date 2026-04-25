import { useUpdateProfile, Profile } from "./useProfile";
import { Mission } from "./useMissions";
import { useToast } from "@/hooks/use-toast";
import { type Rank } from "@/components/ui/RankBadge";

const RANK_ORDER: Rank[] = ["E", "D", "C", "B", "A", "S", "SS", "SSR"];
const RANK_THRESHOLDS: Record<Rank, number> = {
  E: 0, D: 5, C: 15, B: 30, A: 50, S: 80, SS: 120, SSR: 170,
};
const TITLES: Record<Rank, string> = {
  E: "Novato",
  D: "Aprendiz",
  C: "Guerreiro",
  B: "Caçador Elite",
  A: "Comandante",
  S: "Monarca das Sombras",
  SS: "Soberano Supremo",
  SSR: "Deus Absoluto",
};

function getRequiredXP(level: number): number {
  return Math.floor(1000 * Math.pow(1.15, level - 1));
}

export function useProgression() {
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const completeMission = async (mission: Mission, profile: Profile) => {
    let newXP = profile.current_xp + mission.xp_reward;
    let newLevel = profile.level;
    let newRequired = profile.required_xp;
    let leveledUp = false;

    while (newXP >= newRequired) {
      newXP -= newRequired;
      newLevel++;
      newRequired = getRequiredXP(newLevel);
      leveledUp = true;
    }

    const statUpdates: Partial<Profile> = {};
    const rewards = (mission.stat_rewards ?? []) as { stat: string; value: number }[];
    
    const statMap: Record<string, keyof Profile> = {
      INT: "intelligence",
      STR: "strength",
      FCS: "focus",
      KNW: "knowledge",
      DSC: "discipline",
      ENR: "energy",
    };

    for (const r of rewards) {
      const statKey = statMap[r.stat];
      if (statKey) {
        const currentValue = profile[statKey] as number;
        // @ts-expect-error - Dynamic key assignment
        statUpdates[statKey] = Math.min(currentValue + r.value, 999);
      }
    }

    const newRankIndex = RANK_ORDER.findIndex((r) => RANK_THRESHOLDS[r] > newLevel) - 1;
    const newRank = RANK_ORDER[Math.max(0, newRankIndex >= 0 ? newRankIndex : RANK_ORDER.length - 1)];
    const rankChanged = newRank !== profile.rank;

    await updateProfile.mutateAsync({
      current_xp: newXP,
      level: newLevel,
      required_xp: newRequired,
      rank: newRank,
      title: TITLES[newRank] ?? profile.title,
      ...statUpdates,
    });

    if (leveledUp) {
      toast({
        title: `🎉 Level Up! Nível ${newLevel}`,
        description: "Você ficou mais forte. Continue evoluindo!",
      });
    }

    if (rankChanged) {
      toast({
        title: `⚡ Rank ${newRank} Alcançado!`,
        description: `Novo título: ${TITLES[newRank]}`,
      });
    }

    return { leveledUp, rankChanged, newLevel, newRank };
  };

  return { completeMission, isUpdating: updateProfile.isPending };
}

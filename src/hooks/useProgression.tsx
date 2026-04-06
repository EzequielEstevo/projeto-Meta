import { useUpdateProfile, Profile } from "./useProfile";
import { Mission } from "./useMissions";
import { useToast } from "@/hooks/use-toast";

const RANK_ORDER = ["E", "D", "C", "B", "A", "S"];
const RANK_THRESHOLDS: Record<string, number> = {
  E: 0, D: 5, C: 15, B: 30, A: 50, S: 80,
};
const TITLES: Record<string, string> = {
  E: "Novato",
  D: "Aprendiz",
  C: "Guerreiro",
  B: "Caçador Elite",
  A: "Comandante",
  S: "Monarca das Sombras",
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

    // Level up loop
    while (newXP >= newRequired) {
      newXP -= newRequired;
      newLevel++;
      newRequired = getRequiredXP(newLevel);
      leveledUp = true;
    }

    // Stat increases from mission
    const statUpdates: Partial<Profile> = {};
    const rewards = (mission.stat_rewards ?? []) as { stat: string; value: number }[];
    for (const r of rewards) {
      const statKey = {
        INT: "intelligence", STR: "strength", FCS: "focus",
        KNW: "knowledge", DSC: "discipline", ENR: "energy",
      }[r.stat] as keyof Profile | undefined;
      if (statKey && typeof profile[statKey] === "number") {
        statUpdates[statKey as keyof typeof statUpdates] = Math.min(
          (profile[statKey] as number) + r.value,
          999
        ) as any;
      }
    }

    // Rank check
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

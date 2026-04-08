import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateMission } from "@/hooks/useMissions";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Loader2 } from "lucide-react";

export function CreateMissionDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rank, setRank] = useState("D");
  const [priority, setPriority] = useState("normal");
  const [missionType, setMissionType] = useState("daily");
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  const createMission = useCreateMission();
  const { toast } = useToast();

  const xpMap: Record<string, number> = { E: 50, D: 100, C: 200, B: 350, A: 500, S: 1000, SS: 1800, SSR: 3000 };
  const statMap: Record<string, { stat: string; value: number }[]> = {
    E: [{ stat: "ENR", value: 1 }],
    D: [{ stat: "DSC", value: 2 }, { stat: "ENR", value: 1 }],
    C: [{ stat: "INT", value: 3 }, { stat: "KNW", value: 2 }],
    B: [{ stat: "FCS", value: 4 }, { stat: "DSC", value: 3 }],
    A: [{ stat: "STR", value: 5 }, { stat: "FCS", value: 4 }],
    S: [{ stat: "INT", value: 6 }, { stat: "STR", value: 5 }, { stat: "FCS", value: 5 }],
    SS: [{ stat: "INT", value: 8 }, { stat: "STR", value: 7 }, { stat: "FCS", value: 6 }, { stat: "DSC", value: 5 }],
    SSR: [{ stat: "INT", value: 10 }, { stat: "STR", value: 9 }, { stat: "FCS", value: 8 }, { stat: "KNW", value: 7 }, { stat: "DSC", value: 6 }],
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setRank("D"); setPriority("normal");
    setMissionType("daily"); setTimeSlot(""); setDuration(""); setDueDate("");
    setSubtasks([]); setNewSubtask("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createMission.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        rank,
        xp_reward: xpMap[rank] ?? 100,
        time_slot: timeSlot || undefined,
        duration: duration || undefined,
        priority,
        mission_type: missionType,
        stat_rewards: statMap[rank] ?? [],
        due_date: dueDate || undefined,
        subtasks,
      });

      toast({
        title: "⚔️ Missão Criada!",
        description: `"${title}" foi adicionada às suas quests.`,
      });
      resetForm();
      setOpen(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível criar a missão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-background border-primary/30 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-glow-blue">
            <span className="text-primary">[</span> Nova Missão <span className="text-primary">]</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Título da Missão</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Treino matinal de 30 min"
              className="bg-muted/30 border-primary/30 font-body"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da missão..."
              className="bg-muted/30 border-primary/30 font-body resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Rank & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Dificuldade</Label>
              <Select value={rank} onValueChange={setRank}>
                <SelectTrigger className="bg-muted/30 border-primary/30 font-display">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E">E - Muito Fácil</SelectItem>
                  <SelectItem value="D">D - Fácil</SelectItem>
                  <SelectItem value="C">C - Médio</SelectItem>
                  <SelectItem value="B">B - Difícil</SelectItem>
                  <SelectItem value="A">A - Muito Difícil</SelectItem>
                  <SelectItem value="S">S - Extremo</SelectItem>
                  <SelectItem value="SS">SS - Lendário</SelectItem>
                  <SelectItem value="SSR">SSR - Divino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-muted/30 border-primary/30 font-display">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Tipo</Label>
              <Select value={missionType} onValueChange={setMissionType}>
                <SelectTrigger className="bg-muted/30 border-primary/30 font-display">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diária</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="special">Especial</SelectItem>
                  <SelectItem value="boss">Boss Raid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Prazo</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-muted/30 border-primary/30 font-body"
              />
            </div>
          </div>

          {/* Time Slot & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Horário</Label>
              <Input
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="Ex: 06:00 - 07:00"
                className="bg-muted/30 border-primary/30 font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Duração</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 1 hora"
                className="bg-muted/30 border-primary/30 font-body"
              />
            </div>
          </div>

          {/* XP Preview */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="font-display text-sm text-primary">
              Recompensa: <span className="font-bold">+{xpMap[rank] ?? 100} XP</span>
              {statMap[rank]?.map((s, i) => (
                <span key={i} className="text-accent ml-2">+{s.value} {s.stat}</span>
              ))}
            </p>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label className="font-display text-xs uppercase tracking-wider text-muted-foreground">Subtarefas</Label>
            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Adicionar subtarefa..."
                className="bg-muted/30 border-primary/30 font-body"
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask())}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleAddSubtask} className="border-primary/30 text-primary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-1 mt-2">
                {subtasks.map((st, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/20 border border-primary/10">
                    <span className="text-sm font-body text-foreground">{st}</span>
                    <button type="button" onClick={() => handleRemoveSubtask(i)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={createMission.isPending || !title.trim()}
            className="w-full btn-glow bg-gradient-to-r from-primary to-accent text-primary-foreground font-display uppercase tracking-wider h-12"
          >
            {createMission.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "⚔️ Criar Missão"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

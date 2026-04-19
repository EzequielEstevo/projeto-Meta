import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateGoal } from "@/hooks/useGoals";
import { useToast } from "@/hooks/use-toast";

interface CreateGoalDialogProps {
  children: React.ReactNode;
  defaultType?: string;
}

export function CreateGoalDialog({ children, defaultType = "weekly" }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [goalType, setGoalType] = useState(defaultType);
  const [deadline, setDeadline] = useState("");
  const createGoal = useCreateGoal();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    await createGoal.mutateAsync({
      title: title.trim(),
      goal_type: goalType,
      deadline: new Date(deadline).toISOString(),
    });

    toast({ title: "Meta criada!", description: "Sua nova meta foi adicionada." });
    setTitle("");
    setDeadline("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-display text-primary">Nova Meta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Título da meta..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-body bg-muted/50 border-primary/20"
          />
          <Select value={goalType} onValueChange={setGoalType}>
            <SelectTrigger className="font-body bg-muted/50 border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="six_months">6 Meses</SelectItem>
              <SelectItem value="one_year">1 Ano</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <label className="text-xs text-muted-foreground font-display uppercase tracking-wider mb-1 block">Prazo</label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="font-body bg-muted/50 border-primary/20"
            />
          </div>
          <Button
            type="submit"
            disabled={!title.trim() || !deadline || createGoal.isPending}
            className="w-full btn-glow bg-gradient-to-r from-orange-500 to-red-500 text-foreground font-display uppercase tracking-wider"
          >
            {createGoal.isPending ? "Criando..." : "Criar Meta 🔥"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

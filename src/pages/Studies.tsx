import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useDisciplines,
  useTopics,
  useCreateDiscipline,
  useUpdateDiscipline,
  useDeleteDiscipline,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic,
  type Discipline,
} from "@/hooks/useStudies";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  X,
  Save,
  Check,
  ChevronDown,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const COLORS = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B",
  "#10B981", "#EF4444", "#06B6D4", "#F97316",
];

export default function Studies() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: disciplines, isLoading: discLoading } = useDisciplines();
  const { data: allTopics, isLoading: topicsLoading } = useTopics();
  const createDiscipline = useCreateDiscipline();
  const updateDiscipline = useUpdateDiscipline();
  const deleteDiscipline = useDeleteDiscipline();
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const deleteTopic = useDeleteTopic();
  const { toast } = useToast();

  const [newDiscipline, setNewDiscipline] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newTopicTitles, setNewTopicTitles] = useState<Record<string, string>>({});
  const [editingDisc, setEditingDisc] = useState<{ id: string; name: string; color: string } | null>(null);
  const [editingTopic, setEditingTopic] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  if (authLoading || discLoading || topicsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-display text-primary text-glow-blue uppercase tracking-widest">Carregando Estudos...</p>
        </div>
      </div>
    );
  }

  const handleAddDiscipline = async () => {
    const name = newDiscipline.trim();
    if (!name) return;
    await createDiscipline.mutateAsync({ name, color: selectedColor });
    setNewDiscipline("");
    toast({ title: "📚 Disciplina criada!", description: name });
  };

  const handleSaveDisc = async () => {
    if (!editingDisc) return;
    await updateDiscipline.mutateAsync(editingDisc);
    setEditingDisc(null);
    toast({ title: "✏️ Disciplina atualizada!" });
  };

  const handleDeleteDisc = async (id: string) => {
    await deleteDiscipline.mutateAsync(id);
    toast({ title: "🗑️ Disciplina removida!" });
  };

  const handleAddTopic = async (disciplineId: string) => {
    const title = newTopicTitles[disciplineId]?.trim();
    if (!title) return;
    await createTopic.mutateAsync({ title, discipline_id: disciplineId });
    setNewTopicTitles((prev) => ({ ...prev, [disciplineId]: "" }));
    toast({ title: "📝 Assunto adicionado!" });
  };

  const handleSaveTopic = async () => {
    if (!editingTopic) return;
    await updateTopic.mutateAsync({ id: editingTopic.id, title: editingTopic.title });
    setEditingTopic(null);
  };

  const handleToggleTopic = async (id: string, completed: boolean) => {
    await updateTopic.mutateAsync({ id, completed: !completed });
  };

  const getTopicsForDiscipline = (discId: string) =>
    allTopics?.filter((t) => t.discipline_id === discId) ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <header className="border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="font-display font-bold text-2xl text-glow-blue">ESTUDOS</h1>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="font-display text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-3xl">
          {/* Add Discipline */}
          <HolographicPanel variant="blue" className="mb-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-3">
              <span className="text-primary">[</span> Nova Disciplina <span className="text-primary">]</span>
            </h2>
            <div className="flex gap-2 items-center flex-wrap">
              <Input
                placeholder="Ex: Matemática, Física, História..."
                value={newDiscipline}
                onChange={(e) => setNewDiscipline(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDiscipline()}
                className="flex-1 min-w-[200px] h-10 bg-background/50 border-primary/20 font-body"
              />
              <div className="flex gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all",
                      selectedColor === c ? "border-foreground scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <Button size="sm" onClick={handleAddDiscipline} disabled={!newDiscipline.trim()} className="font-display">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
          </HolographicPanel>

          {/* Disciplines List */}
          {(!disciplines || disciplines.length === 0) && (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-body">Nenhuma disciplina cadastrada ainda.</p>
              <p className="text-muted-foreground/60 font-body text-sm mt-1">Crie disciplinas para organizar seus estudos!</p>
            </div>
          )}

          <div className="space-y-3">
            {disciplines?.map((disc) => {
              const topics = getTopicsForDiscipline(disc.id);
              const isExpanded = expandedId === disc.id;
              const completedCount = topics.filter((t) => t.completed).length;

              return (
                <HolographicPanel key={disc.id} variant="blue" className="overflow-hidden">
                  {/* Discipline header */}
                  {editingDisc?.id === disc.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={editingDisc.name}
                        onChange={(e) => setEditingDisc({ ...editingDisc, name: e.target.value })}
                        className="flex-1 h-8 text-sm bg-background/50 border-primary/20 font-body"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setEditingDisc({ ...editingDisc, color: c })}
                            className={cn(
                              "w-5 h-5 rounded-full border-2 transition-all",
                              editingDisc.color === c ? "border-foreground scale-110" : "border-transparent opacity-60"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <button onClick={handleSaveDisc} className="text-secondary hover:text-secondary/80"><Save className="w-4 h-4" /></button>
                      <button onClick={() => setEditingDisc(null)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : disc.id)}>
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: disc.color }} />
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-primary shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <span className="font-display font-bold text-foreground flex-1">{disc.name}</span>
                      <span className="text-xs text-muted-foreground font-body">
                        {completedCount}/{topics.length} assuntos
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingDisc({ id: disc.id, name: disc.name, color: disc.color }); }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteDisc(disc.id); }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Progress bar */}
                  {topics.length > 0 && (
                    <div className="w-full h-1 rounded-full bg-muted/30 mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round((completedCount / topics.length) * 100)}%`,
                          backgroundColor: disc.color,
                        }}
                      />
                    </div>
                  )}

                  {/* Topics */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-primary/10 space-y-2">
                      {topics.map((topic) => (
                        <div key={topic.id}>
                          {editingTopic?.id === topic.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingTopic.title}
                                onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                                className="flex-1 h-7 text-sm bg-background/50 border-primary/20 font-body"
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleSaveTopic()}
                              />
                              <button onClick={handleSaveTopic} className="text-secondary hover:text-secondary/80"><Save className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setEditingTopic(null)} className="text-muted-foreground hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <div className={cn(
                              "flex items-center gap-2 p-2 rounded-lg border transition-all",
                              topic.completed
                                ? "bg-secondary/10 border-secondary/30"
                                : "bg-muted/10 border-primary/10 hover:border-primary/30"
                            )}>
                              <button
                                onClick={() => handleToggleTopic(topic.id, topic.completed)}
                                className={cn(
                                  "w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0",
                                  topic.completed
                                    ? "bg-secondary border-secondary text-secondary-foreground"
                                    : "border-primary/40 hover:border-primary"
                                )}
                              >
                                {topic.completed && <Check className="w-3 h-3" />}
                              </button>
                              <span className={cn("flex-1 text-sm font-body", topic.completed && "line-through text-muted-foreground")}>
                                {topic.title}
                              </span>
                              <button onClick={() => setEditingTopic({ id: topic.id, title: topic.title })} className="text-muted-foreground hover:text-primary transition-colors">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteTopic.mutate(topic.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add topic */}
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Novo assunto..."
                          value={newTopicTitles[disc.id] ?? ""}
                          onChange={(e) => setNewTopicTitles((prev) => ({ ...prev, [disc.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleAddTopic(disc.id)}
                          className="flex-1 h-8 text-sm bg-background/50 border-primary/20 font-body"
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleAddTopic(disc.id)} disabled={!newTopicTitles[disc.id]?.trim()} className="h-8 w-8 p-0 text-primary">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </HolographicPanel>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

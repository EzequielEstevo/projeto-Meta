import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Swords, 
  LogOut, 
  Plus, 
  CalendarDays, 
  Target, 
  BookOpen, 
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", color: "hover:text-primary" },
    { label: "Metas", icon: Target, path: "/goals", color: "hover:text-orange-400" },
    { label: "Rotinas", icon: CalendarDays, path: "/routines", color: "hover:text-primary" },
    { label: "Estudos", icon: BookOpen, path: "/studies", color: "hover:text-cyan-400" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <Swords className="w-8 h-8 text-primary" />
            <h1 className="font-display font-bold text-2xl text-glow-blue tracking-tighter">SISTEMA</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "font-display text-muted-foreground transition-colors",
                  item.color,
                  location.pathname === item.path && "text-primary bg-primary/10"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                <span>{item.label}</span>
              </Button>
            ))}
            <div className="w-px h-4 bg-primary/20 mx-2" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut} 
              className="font-display text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sair</span>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 border-primary/20 backdrop-blur-xl p-0">
                <SheetHeader className="p-6 border-b border-primary/10">
                  <SheetTitle className="font-display text-primary flex items-center gap-2">
                    <Swords className="w-6 h-6" />
                    SISTEMA
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={cn(
                        "justify-start font-display text-lg py-6",
                        location.pathname === item.path ? "text-primary bg-primary/10" : "text-muted-foreground"
                      )}
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-4" />
                      {item.label}
                    </Button>
                  ))}
                  <div className="h-px bg-primary/10 my-4" />
                  <Button
                    variant="ghost"
                    className="justify-start font-display text-lg py-6 text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-4" />
                    Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

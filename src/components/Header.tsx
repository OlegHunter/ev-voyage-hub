import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Send } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl">CarHunter™</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/catalog" className="transition-colors hover:text-primary">
            Каталог
          </Link>
          <Link to="/financing" className="transition-colors hover:text-primary">
            Фінансування
          </Link>
          <Link to="/process" className="transition-colors hover:text-primary">
            Процес
          </Link>
          <Link to="/service" className="transition-colors hover:text-primary">
            Сервіс
          </Link>
          <Link to="/shop" className="transition-colors hover:text-primary">
            Магазин
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <a href="tel:+380441234567" className="hidden md:flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>+380 44 123 4567</span>
          </a>
          <a href="https://t.me/carhunter" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 mr-2" />
              Telegram
            </Button>
          </a>
          <Button size="sm" className="animate-pulse-glow">
            Залишити заявку
          </Button>
        </div>
      </div>
    </header>
  );
};
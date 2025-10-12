import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-dark border-t border-white/10">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xl text-primary">CarHunter™</h3>
            <p className="text-sm text-muted-foreground">
              Професійний підбір та доставка електромобілів з Китаю, США та Європи з повним юридичним супроводом.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://t.me/carhunter_ua" className="h-10 w-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg">Навігація</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Каталог авто
              </Link>
              <Link to="/financing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Фінансування
              </Link>
              <Link to="/process" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Процес роботи
              </Link>
              <Link to="/service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Сервіс
              </Link>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Автотовари
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg">Послуги</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Підбір авто
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Доставка RORO
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Контейнерна доставка
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Розмитнення
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Технічна інспекція
              </a>
            </nav>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg">Контакти</h3>
            <div className="space-y-3">
              <a href="tel:+380932639262" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +38 (093) 263-92-62
              </a>
              <a href="tel:+380985155338" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +38 (098) 515-53-38
              </a>
              <a href="tel:+380936394429" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +38 (093) 639-44-29
              </a>
              <a href="mailto:carhunterhub@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                carhunterhub@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <p>м. Одеса, пров. Катаєва 2а</p>
                  <p>Київ ТРЦ Республіка</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 CarHunter™. Всі права захищені.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Політика конфіденційності</a>
            <a href="#" className="hover:text-primary transition-colors">Умови використання</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

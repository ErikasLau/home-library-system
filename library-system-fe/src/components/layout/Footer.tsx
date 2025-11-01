import { Heart, BookOpen } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-muted/50 via-muted/30 to-background border-t-2 border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* About Section */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">About</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed text-center md:text-left">
              Organize and manage your personal book collection with ease. Share your libraries with friends or keep them private. Track your reading progress, add reviews, and discover new books through our community.
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              <span>© {currentYear} Home Library System.</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" /> for book lovers
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Mail, MessageCircle, Wrench } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const whatsappNumber = "919055767149";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%2C%20I%20have%20a%20query%20about%20One%20Tap%20Service`;

  return (
    <footer className="border-t border-border bg-white mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                One Tap <span className="text-primary">Service</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting you with trusted home service experts.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
              Reports &amp; Queries
            </h4>
            <div className="space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp: +91 90557 67149
              </a>
              <a
                href="mailto:itsfuture448@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                itsfuture448@gmail.com
              </a>
              <p className="text-xs text-muted-foreground pl-6">
                WhatsApp messages only (no calls)
              </p>
            </div>
          </div>

          {/* Built with */}
          <div className="flex md:justify-end items-start">
            <p className="text-sm text-muted-foreground">
              © {year} One Tap Service. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

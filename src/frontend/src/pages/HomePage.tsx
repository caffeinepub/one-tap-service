import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Mail,
  MessageCircle,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import {
  ALL_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from "../lib/categoryConfig";

const WHY_ITEMS = [
  {
    id: "verified",
    icon: Shield,
    title: "Verified Experts",
    desc: "All service professionals are vetted and verified before joining our platform.",
  },
  {
    id: "quick",
    icon: Clock,
    title: "Quick Response",
    desc: "Direct calling means faster response. No middleman, no delays.",
  },
  {
    id: "experienced",
    icon: Star,
    title: "Experienced Pros",
    desc: "Browse experts by years of experience and find the best match for your needs.",
  },
];

const whatsappNumber = "919055767149";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%2C%20I%20have%20a%20query%20about%20One%20Tap%20Service`;

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/30 to-primary/5 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              Trusted Home Services Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Find Trusted
              <br />
              <span className="text-primary">Home Service</span> Experts
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Connect with verified electricians, plumbers, AC technicians, and
              more. Get fast, reliable help for all your home repair needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="gap-2 shadow-orange"
                data-ocid="hero.find_experts.button"
              >
                <Link to="/experts">
                  Find Experts <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                data-ocid="hero.become_expert.button"
              >
                <Link to="/dashboard">Become an Expert</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative bg shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-display font-bold text-2xl text-primary">
                500+
              </p>
              <p className="text-sm text-muted-foreground">Verified Experts</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-primary">
                10K+
              </p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-primary">
                4.9★
              </p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20" data-ocid="home.categories.section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Browse by Service
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the service you need and connect with an expert instantly
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_CATEGORIES.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat];
              const colorClass = CATEGORY_COLORS[cat];
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <Link
                    to="/experts"
                    search={{ category: cat }}
                    className="group block"
                    data-ocid={`home.category.${i + 1}.link`}
                  >
                    <div className="bg-white border border-border rounded-xl p-6 text-center hover:border-primary/40 hover:shadow-card transition-all duration-200 group-hover:-translate-y-0.5">
                      <div
                        className={`w-14 h-14 rounded-xl mx-auto flex items-center justify-center mb-3 border ${colorClass}`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="font-display font-semibold text-sm text-foreground">
                        {CATEGORY_LABELS[cat]}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why One Tap Service */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Why Choose One Tap Service?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white rounded-xl p-6 border border-border shadow-xs"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary rounded-2xl px-8 py-12 max-w-2xl mx-auto shadow-orange">
            <h2 className="font-display font-bold text-3xl text-white mb-3">
              Are You a Service Expert?
            </h2>
            <p className="text-white/80 mb-6">
              Join One Tap Service and connect with customers who need your
              skills. Sign up in minutes and start getting calls today.
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
              data-ocid="home.expert_signup.button"
            >
              <Link to="/dashboard">Sign Up as Expert</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact / Reports & Queries */}
      <section className="py-16 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Reports &amp; Queries
            </h2>
            <p className="text-muted-foreground text-lg">
              Have a question or want to report an issue? Reach out to us.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-xl mx-auto">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl px-8 py-6 w-full sm:w-auto hover:bg-[#25D366]/20 transition-colors"
            >
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-base text-foreground">
                  WhatsApp
                </p>
                <p className="text-sm text-muted-foreground">+91 90557 67149</p>
                <p className="text-xs text-[#25D366] font-medium mt-0.5">
                  Message only (no calls)
                </p>
              </div>
            </motion.a>

            <motion.a
              href="mailto:itsfuture448@gmail.com"
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-4 bg-primary/5 border border-primary/20 rounded-2xl px-8 py-6 w-full sm:w-auto hover:bg-primary/10 transition-colors"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-base text-foreground">
                  Email
                </p>
                <p className="text-sm text-muted-foreground">
                  itsfuture448@gmail.com
                </p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imagePosition: 'left' | 'right';
  roleColor: string;
  roleIcon: React.ReactNode;
  roleLabel: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  imagePosition, 
  roleColor,
  roleIcon,
  roleLabel 
}: AuthLayoutProps) {
  const ImageSection = () => (
    <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${roleColor} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-20 w-48 h-48 bg-white/10 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              {roleIcon}
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">{roleLabel} Portal</h2>
          <p className="text-xl text-white/80 max-w-md">
            Secure access to your LoanAgent dashboard with enterprise-grade security
          </p>
        </motion.div>

        {/* Stats or Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold">99.9%</div>
            <div className="text-sm text-white/70">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold">256-bit</div>
            <div className="text-sm text-white/70">Encryption</div>
          </div>
          <div>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm text-white/70">Support</div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const FormSection = () => (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background">
      <motion.div
        initial={{ opacity: 0, x: imagePosition === 'left' ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">LoanAgent</span>
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {children}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {imagePosition === 'left' ? (
        <>
          <ImageSection />
          <FormSection />
        </>
      ) : (
        <>
          <FormSection />
          <ImageSection />
        </>
      )}
    </div>
  );
}

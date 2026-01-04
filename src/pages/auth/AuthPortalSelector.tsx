import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Shield, Users, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const portals = [
  {
    title: 'Super Admin',
    description: 'Platform administration & oversight',
    icon: Shield,
    path: '/auth/superadmin',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
  },
  {
    title: 'Admin',
    description: 'Organization management',
    icon: Building2,
    path: '/auth/admin',
    color: 'from-primary to-primary/80',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
  },
  {
    title: 'Agent',
    description: 'Lead & customer management',
    icon: Users,
    path: '/auth/agent',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    title: 'Customer',
    description: 'Apply for loans & track status',
    icon: User,
    path: '/auth/customer',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
];

export default function AuthPortalSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">LoanAgent</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Select Your Portal</h1>
          <p className="text-muted-foreground">Choose your role to access the appropriate login</p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={portal.path}>
                <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${portal.borderColor} hover:border-opacity-50`}>
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 rounded-2xl ${portal.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${portal.color}`}>
                        <portal.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {portal.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {portal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-sm font-medium bg-gradient-to-r ${portal.color} bg-clip-text text-transparent`}>
                      Continue →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-muted-foreground">
          <p>Need help? Contact <a href="mailto:support@loanagent.com" className="text-primary hover:underline">support@loanagent.com</a></p>
        </div>
      </motion.div>
    </div>
  );
}

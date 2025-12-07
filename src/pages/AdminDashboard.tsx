import { motion } from 'framer-motion';
import { Users, Store, Package, DollarSign, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore, useProductStore } from '@/store';
import { useNavigate, Link } from 'react-router-dom';
import { mockTraders, mockUsers } from '@/data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { products } = useProductStore();

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/admin-login');
    return null;
  }

  const stats = [
    { title: 'Total Users', value: mockUsers.length, icon: Users, color: 'text-blue-500' },
    { title: 'Total Traders', value: mockTraders.length, icon: Store, color: 'text-green-500' },
    { title: 'Total Products', value: products.length, icon: Package, color: 'text-accent' },
    { title: 'Revenue', value: '$125K', icon: DollarSign, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" />
            <span className="font-bold text-xl">Admin Panel</span>
          </div>
          <Link to="/">
            <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground/80">
              Exit Admin
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="traders">
            <TabsList>
              <TabsTrigger value="traders">Traders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="traders" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Manage Traders</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTraders.map(trader => (
                      <div key={trader.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <img src={trader.avatar} alt={trader.name} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-medium">{trader.shopName}</p>
                            <p className="text-sm text-muted-foreground">{trader.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={trader.verified ? 'success' : 'muted'}>
                            {trader.verified ? 'Verified' : 'Pending'}
                          </Badge>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Manage Users</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {u.avatar ? <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full" /> : u.name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <Card>
                <CardHeader><CardTitle>All Products</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {products.slice(0, 6).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">by {product.traderName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">${product.price}</span>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

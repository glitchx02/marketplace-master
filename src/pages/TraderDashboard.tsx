import { motion } from 'framer-motion';
import { Package, DollarSign, TrendingUp, Eye, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore, useProductStore } from '@/store';
import { useNavigate, Link } from 'react-router-dom';
import { Trader } from '@/types';

export default function TraderDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { products } = useProductStore();

  if (!isAuthenticated || user?.role !== 'trader') {
    navigate('/login?role=trader');
    return null;
  }

  const trader = user as Trader;
  const traderProducts = products.filter(p => p.traderId === trader.id);
  const totalRevenue = traderProducts.reduce((sum, p) => sum + p.price * p.sold, 0);
  const totalSold = traderProducts.reduce((sum, p) => sum + p.sold, 0);

  const stats = [
    { title: 'Total Products', value: traderProducts.length, icon: Package, color: 'text-blue-500' },
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Items Sold', value: totalSold, icon: TrendingUp, color: 'text-accent' },
    { title: 'Views', value: '12.5K', icon: Eye, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{trader.shopName}</h1>
              <p className="text-muted-foreground">{trader.shopDescription}</p>
              <Badge variant={trader.verified ? 'success' : 'muted'} className="mt-2">
                {trader.verified ? 'Verified Seller' : 'Pending Verification'}
              </Badge>
            </div>
            <Button variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

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

          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
            </CardHeader>
            <CardContent>
              {traderProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No products yet. Add your first product!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {traderProducts.map(product => (
                    <Card key={product.id} hover>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <p className="text-lg font-bold">${product.price}</p>
                            <p className="text-xs text-muted-foreground">{product.sold} sold • {product.stock} in stock</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

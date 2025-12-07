import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Users, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/products';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useProductStore } from '@/store';

const features = [
  {
    icon: ShoppingBag,
    title: 'Curated Selection',
    description: 'Hand-picked products from verified traders worldwide',
  },
  {
    icon: Users,
    title: 'Trusted Sellers',
    description: 'Every trader is verified for quality and reliability',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your transactions are protected with enterprise security',
  },
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'Competitive prices with exclusive deals and discounts',
  },
];

const Index = () => {
  const { products } = useProductStore();
  const featuredProducts = products.filter(p => p.isPromoted).slice(0, 4);
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="container relative py-24 md:py-32 lg:py-40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent"
              >
                <span className="animate-pulse-soft">🎉</span>
                New: Earn rewards on every purchase
              </motion.div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Discover Products
                <br />
                <span className="text-accent">You'll Love</span>
              </h1>
              
              <p className="text-lg text-primary-foreground/80 md:text-xl max-w-xl">
                Shop from thousands of trusted traders. Find unique items, exclusive deals, and everything in between.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/shop">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login?role=trader">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-transparent shadow-none">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                        <feature.icon className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Featured Products</h2>
                  <p className="text-muted-foreground mt-1">Handpicked by our team</p>
                </div>
                <Link to="/shop">
                  <Button variant="ghost">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trending Products */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground mt-1">What everyone's buying</p>
              </div>
              <Link to="/shop">
                <Button variant="ghost">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trendingProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-8 md:p-16 text-primary-foreground"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              
              <div className="relative max-w-2xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Start Selling?
                </h2>
                <p className="text-lg text-primary-foreground/80">
                  Join thousands of successful traders and reach millions of customers worldwide.
                </p>
                <Link to="/login?role=trader">
                  <Button variant="hero" size="xl">
                    Open Your Shop Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
